// [code lama + code hasil pembaharuan = code update]
import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import supabase from '../lib/supabaseClient';

type Props = {
  onUpload: (publicUrl: string) => void;
  bucket?: string;
  folder?: string;
};

// Mengubah default bucket dari 'product-images' menjadi 'product_images'
export default function ImageUploader({ onUpload, bucket = 'product_images', folder = '' }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const filePath = `${folder ? folder + '/' : ''}${Date.now()}_${file.name}`;
      const { data, error: uploadErr } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      const publicUrl = publicData.publicUrl;
      onUpload(publicUrl);
      setPreview(publicUrl);
    } catch (e: any) {
      console.error('Upload error', e);
      alert('Gagal mengunggah gambar: ' + (e.message || String(e)));
    } finally {
      setUploading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  return (
    <div>
      <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="w-full border border-dashed border-gray-700 rounded-lg p-3 bg-[#0f0f13] flex items-center gap-3">
        <div className="w-20 h-20 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          {preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <div className="text-xs text-gray-500">Preview</div>}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-2">Tarik & lepas gambar di sini, atau pilih dari perangkat.</div>
          <div className="flex gap-2">
            <button onClick={() => inputRef.current?.click()} className="px-3 py-2 bg-cyan-500 text-black rounded-md font-bold">Pilih Gambar</button>
            <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onChange} className="hidden" />
            <button onClick={() => { alert('Gunakan fitur kamera jika perangkat mendukung input capture.'); }} className="px-3 py-2 bg-gray-800 text-gray-200 rounded-md">Buka Kamera</button>
          </div>
          <div className="text-xs text-gray-500 mt-2">File akan diunggah ke bucket <strong>{bucket}</strong>.</div>
        </div>
        <div className="w-24 text-right">
          {uploading ? <div className="text-sm text-cyan-400">Mengunggah...</div> : null}
        </div>
      </div>
    </div>
  );
}
