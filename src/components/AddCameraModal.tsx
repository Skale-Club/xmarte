'use client';

import { useState } from 'react';
import { useCameraStore } from '@/store/cameraStore';
import { validateCameraConfig } from '@/lib/tapo-stream';
import { X, Camera, Wifi } from 'lucide-react';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCameraModal({ isOpen, onClose }: AddCameraModalProps) {
  const { addCamera } = useCameraStore();
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    username: '',
    password: '',
    stream: 'stream1' as 'stream1' | 'stream2',
  });
  const [error, setError] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  console.log('AddCameraModal rendered, isOpen:', isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Generate unique ID
    const id = `camera_${Date.now()}`;

    const camera = {
      id,
      ...formData,
    };

    // Validate camera configuration
    if (!validateCameraConfig(camera)) {
      setError('Invalid camera configuration. Please check all fields.');
      return;
    }

    try {
      console.log('Adding camera:', camera);
      // Add camera to store
      addCamera(camera);
      console.log('Camera added successfully');

      // Reset form
      setFormData({
        name: '',
        ip: '',
        username: '',
        password: '',
        stream: 'stream1',
      });

      alert('Camera added successfully!');
      onClose();
    } catch (err) {
      setError('Failed to add camera. Please try again.');
      console.error('Error adding camera:', err);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setError(null);

    try {
      const response = await fetch('/api/camera/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraIp: formData.ip,
          username: formData.username,
          password: formData.password,
          stream: formData.stream,
        }),
      });

      if (!response.ok) {
        throw new Error('Connection test failed');
      }

      alert('Connection successful! ✓');
    } catch (err) {
      setError('Connection test failed. Please check your credentials and camera IP.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Tapo Camera</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Camera Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Camera Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Front Door, Backyard"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Camera IP */}
          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-1">
              Camera IP Address
            </label>
            <input
              type="text"
              id="ip"
              value={formData.ip}
              onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              placeholder="192.168.1.100"
              pattern="^(\d{1,3}\.){3}\d{1,3}$"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Find this in your router's DHCP client list or Tapo app
            </p>
          </div>

          {/* Device Account Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Device Account Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Device account username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Create in Tapo app: Settings → Advanced → Device Account
            </p>
          </div>

          {/* Device Account Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Device Account Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Device account password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Stream Quality */}
          <div>
            <label htmlFor="stream" className="block text-sm font-medium text-gray-700 mb-1">
              Stream Quality
            </label>
            <select
              id="stream"
              value={formData.stream}
              onChange={(e) =>
                setFormData({ ...formData, stream: e.target.value as 'stream1' | 'stream2' })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="stream1">High Quality (1080p) - stream1</option>
              <option value="stream2">Low Quality (360p) - stream2</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Use stream2 if experiencing lag or bandwidth issues
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingConnection || !formData.ip || !formData.username || !formData.password}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Wifi className="w-4 h-4" />
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Add Camera
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
