'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  storyId: number;
  storyTitle: string;
}

export default function DeleteButton({ storyId, storyTitle }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      router.refresh();
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
