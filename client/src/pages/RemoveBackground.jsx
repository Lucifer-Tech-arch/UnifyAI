import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setInput(file);
    setContent('');
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error('Please upload an image');
    setLoading(true);

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post(
        '/api/ai/background-removal',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="font-semibold text-xl">AI Background Removal</h1>
        </div>

        <p className="mb-2 text-sm font-medium">Upload Image</p>
        <input
          onChange={onFileChange}
          type="file"
          accept="image/*"
          className="w-full mb-2 text-gray-600 p-2 px-3 outline-none text-sm rounded-md border border-gray-300"
          required
        />
        <p className="font-light text-xs text-gray-500 mb-3">
          Supports JPG, PNG, and other image formats
        </p>

        {preview && (
          <div className="mb-3">
            <img
              src={preview}
              alt="Preview"
              className="rounded-md w-full object-contain max-h-56"
            />
          </div>
        )}

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#F6AB41,#FF4938)] text-white px-4 py-2 mt-3 text-sm rounded-lg cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </form>

      {/* Right Section */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3 mb-2">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400 flex-col gap-4">
            <Eraser className="w-9 h-9" />
            <p className="text-sm text-center">
              Upload an image and click "Remove Background" to get started
            </p>
          </div>
        ) : (
          <img
            src={content}
            alt="Processed"
            className="mt-3 w-full h-auto rounded-md object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
