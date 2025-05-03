'use client';

import React, { useEffect, useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  onDelete?: (deletedUrl: string) => void; // <<-- جديد
};

type FileInfo = {
  type: string;
  size: string;
  width?: number;
  height?: number;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${size} ${sizes[i]}`;
}

// استخراج key من URL
function getKeyFromUrl(url: string): string {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.slice(1)); // حذف أول "/"
}

export const ModalForm: React.FC<ModalProps> = ({ isOpen, onClose, url,onDelete }) => {
  const [info, setInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && url) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);

        try {
          const res = await fetch(`/api/files/fileInfo?url=${encodeURIComponent(url)}`);
          const data = await res.json();

          if (!res.ok) throw new Error(data.error || 'Unknown error');

          setInfo(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load info');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, url]);

  const handleDelete = async () => {
    if (!url) return;
    const key = getKeyFromUrl(url);

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error deleting file');
      if (onDelete) {
        onDelete(url);
      }

      onClose(); // إغلاق المودال بعد الحذف
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-10/12 w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Information
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            ×
          </button>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="rounded-lg bg-black aspect-[650/300] h-[200px] max-[400px]:h-[125px] max-[500px]:h-[150px] max-[770px]:h-[200px]">
            <img
              src={url || ''}
              alt="Preview"
              className="object-contain rounded-lg h-full w-full"
            />
          </div>

          <div className="flex flex-col justify-between text-sm text-gray-700 dark:text-gray-200">
            <a
              href={url || ''}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all underline"
            >
              {url}
            </a>

            {loading && <p className="mt-2 text-blue-500">Loading info...</p>}

            {error && <p className="mt-2 text-red-500">Error: {error}</p>}

            {info && (
              <div className="mt-2 space-y-1">
                <p><strong>Type:</strong> {info.type}</p>
                <p><strong>Size:</strong> {formatBytes(Number(info.size))}</p>
                {info.width && info.height && (
                  <p><strong>Dimensions:</strong> {info.width} × {info.height}</p>
                )}
              </div>
            )}

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
