'use client';

import { useState, useEffect } from 'react';
import TapoCameraStream from '@/components/TapoCameraStream';
import AddCameraModal from '@/components/AddCameraModal';
import { useCameraStore } from '@/store/cameraStore';
import { Camera, Plus, Trash2, Grid3x3, Square } from 'lucide-react';

export default function CamerasPage() {
  const { cameras, removeCamera, loadCameras } = useCameraStore();
  const [selectedView, setSelectedView] = useState<'grid' | 'single'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);

  // Load cameras from localStorage on mount
  useEffect(() => {
    loadCameras();
  }, [loadCameras]);

  const handleDeleteCamera = (id: string) => {
    if (confirm('Are you sure you want to remove this camera?')) {
      removeCamera(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tapo Camera Streams
            </h1>
            <p className="text-gray-600">
              Live view from your TP-Link Tapo cameras
            </p>
          </div>
          <button
            onClick={() => {
              console.log('Add Device button clicked');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Device
          </button>
        </div>

        {/* Empty State */}
        {cameras.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No cameras added yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first Tapo camera
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Your First Camera
            </button>

            {/* Quick Setup Guide */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Quick Setup Guide
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                <li>Open the Tapo app on your phone</li>
                <li>Go to Camera Settings → Advanced Settings → Device Account</li>
                <li>Create a Device Account with username and password</li>
                <li>Find your camera's IP address in your router or Tapo app</li>
                <li>Click "Add Device" above and enter the information</li>
                <li>Start the RTSP server: <code className="bg-blue-100 px-2 py-1 rounded">node server/rtsp-websocket-server.js</code></li>
              </ol>
            </div>
          </div>
        )}

        {/* Camera Controls */}
        {cameras.length > 0 && (
          <>
            <div className="mb-6 flex gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedView('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedView === 'grid'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  Grid View
                </button>
                <button
                  onClick={() => setSelectedView('single')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedView === 'single'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  Single View
                </button>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {cameras.length} camera{cameras.length !== 1 ? 's' : ''} connected
                </span>
              </div>
            </div>

            {/* Camera Streams - Grid View */}
            {selectedView === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cameras.map((camera) => (
                  <div key={camera.id} className="bg-white rounded-lg shadow-md p-4 relative group">
                    <button
                      onClick={() => handleDeleteCamera(camera.id)}
                      className="absolute top-6 right-6 z-10 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove camera"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <TapoCameraStream
                      camera={camera}
                      width={640}
                      height={360}
                      autoplay={true}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Camera Streams - Single View */}
            {selectedView === 'single' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto relative group">
                  <button
                    onClick={() => handleDeleteCamera(cameras[selectedCameraIndex].id)}
                    className="absolute top-8 right-8 z-10 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove camera"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <TapoCameraStream
                    camera={cameras[selectedCameraIndex]}
                    width={1280}
                    height={720}
                    autoplay={true}
                  />
                </div>

                {/* Camera Selector */}
                {cameras.length > 1 && (
                  <div className="mt-6 flex justify-center gap-2">
                    {cameras.map((camera, index) => (
                      <button
                        key={camera.id}
                        onClick={() => setSelectedCameraIndex(index)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedCameraIndex === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {camera.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Streaming Instructions
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Ensure your cameras are accessible on your local network</li>
                <li>Start the RTSP WebSocket server: <code className="bg-blue-100 px-2 py-1 rounded">node server/rtsp-websocket-server.js</code></li>
                <li>Refresh this page to see live streams</li>
                <li>Add more cameras using the "Add Device" button above</li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Troubleshooting
              </h3>
              <ul className="list-disc list-inside space-y-2 text-yellow-800">
                <li>Verify camera IP addresses are correct and cameras are powered on</li>
                <li>Ensure RTSP is enabled on your Tapo cameras (some models require firmware update)</li>
                <li>Check that the WebSocket server is running on the correct ports</li>
                <li>Confirm firewall settings allow connections on ports 554 (RTSP) and WebSocket ports</li>
                <li>Use stream2 instead of stream1 if you experience lag (lower quality, better performance)</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Add Camera Modal */}
      <AddCameraModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
