'use client';

import { useRouter } from 'next/navigation';

export default function EditButton() {
  const router = useRouter();

  const handleEdit = () => {
    router.push('/profile/edit'); 
  };

  return (
    <button onClick={handleEdit} style={{ padding: 10, marginTop: 20, cursor: 'pointer' }}>
      Modifier mon profil
    </button>
  );
}
