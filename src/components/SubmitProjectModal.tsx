import React, { useEffect, useState } from 'react';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import {
  AI_VISION_IMAGE,
  ARDUINO_IMAGE,
  HERO_LAB_IMAGE,
  ROVER_IMAGE,
} from '../data/roboLearnData';
import { GallerySubmission, StudentProfile, TrackSlug } from '../types/platform';
import { ResilientImage } from './ResilientImage';

interface SubmitProjectModalProps {
  isOpen: boolean;
  profile: StudentProfile;
  editingSubmission?: GallerySubmission | null;
  onClose: () => void;
  onSubmit: (submission: GallerySubmission, isEdit: boolean) => Promise<void> | void;
}

const TRACK_IMAGES: Record<TrackSlug, { label: string; image: string }> = {
  robotics: { label: 'Robotics', image: ROVER_IMAGE },
  scratch: { label: 'Scratch', image: HERO_LAB_IMAGE },
  python: { label: 'Python', image: HERO_LAB_IMAGE },
  arduino: { label: 'Arduino', image: ARDUINO_IMAGE },
  'ai-ml': { label: 'AI & ML', image: AI_VISION_IMAGE },
};

function parseListInput(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image format. Please choose a JPG or PNG file.'));
      img.onload = () => {
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  isOpen,
  profile,
  editingSubmission = null,
  onClose,
  onSubmit,
}) => {
  const [studentName, setStudentName] = useState(profile.name);
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<TrackSlug>('robotics');
  const [description, setDescription] = useState('');
  const [objectivesInput, setObjectivesInput] = useState('');
  const [componentsInput, setComponentsInput] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [codeHighlight, setCodeHighlight] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (editingSubmission) {
      setStudentName(editingSubmission.studentName);
      setTitle(editingSubmission.title);
      setTrack(editingSubmission.track);
      setDescription(editingSubmission.description);
      setObjectivesInput((editingSubmission.learningObjectives ?? []).join('\n'));
      setComponentsInput((editingSubmission.componentsUsed ?? []).join(', '));
      setUploadedImageUrl(editingSubmission.imageUrl || null);
      setCodeHighlight(editingSubmission.codeHighlight ?? '');
    } else {
      setStudentName(profile.name);
      setTitle('');
      setTrack(profile.favoriteTrack ?? 'robotics');
      setDescription('');
      setObjectivesInput('');
      setComponentsInput('');
      setUploadedImageUrl(null);
      setCodeHighlight('');
    }
  }, [isOpen, editingSubmission, profile.name, profile.favoriteTrack]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Please choose an image smaller than 8 MB.');
      return;
    }
    setError(null);
    setImageProcessing(true);
    try {
      const dataUrl = await compressImageFile(file);
      setUploadedImageUrl(dataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to process image upload.');
    } finally {
      setImageProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanStudent = studentName.trim();
    const cleanTitle = title.trim();
    const cleanDesc = description.trim();
    const objectives = objectivesInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const components = parseListInput(componentsInput);

    if (cleanStudent.length < 2) {
      setError('Please enter the student name (at least 2 characters).');
      return;
    }
    if (cleanTitle.length < 3) {
      setError('Please enter a project title (at least 3 characters).');
      return;
    }
    if (cleanDesc.length < 12) {
      setError('Please enter a project description (at least 12 characters).');
      return;
    }
    if (objectives.length === 0) {
      setError('Please add at least one learning objective.');
      return;
    }
    if (components.length === 0) {
      setError('Please list at least one component or tool used in your project.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const meta = TRACK_IMAGES[track];
      const submission: GallerySubmission = {
        id: editingSubmission ? editingSubmission.id : `gal-${Date.now()}`,
        title: cleanTitle,
        studentName: cleanStudent,
        studentAge: editingSubmission ? editingSubmission.studentAge : profile.age,
        track,
        trackLabel: meta.label,
        description: cleanDesc,
        learningObjectives: objectives,
        componentsUsed: components,
        imageUrl: uploadedImageUrl ?? meta.image,
        likes: editingSubmission ? editingSubmission.likes : 1,
        submittedAt: editingSubmission ? editingSubmission.submittedAt : 'Just now',
        codeHighlight: codeHighlight.trim() || undefined,
        isOwner: true,
      };
      await onSubmit(submission, Boolean(editingSubmission));
      onClose();
    } catch {
      setError('Could not save your project right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const previewSrc = uploadedImageUrl ?? TRACK_IMAGES[track].image;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-project-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-xl my-auto max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h2 id="submit-project-title" className="font-display text-lg font-bold text-slate-900">
            {editingSubmission ? 'Edit Student Project' : 'Submit Project to Student Gallery'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close submission modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sub-student" className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name *
              </label>
              <input
                id="sub-student"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., Alex Rivera"
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="sub-track" className="block text-xs font-semibold text-slate-700 mb-1">
                Project Category *
              </label>
              <select
                id="sub-track"
                value={track}
                onChange={(e) => setTrack(e.target.value as TrackSlug)}
                className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="robotics">Robotics</option>
                <option value="scratch">Scratch</option>
                <option value="python">Python</option>
                <option value="arduino">Arduino</option>
                <option value="ai-ml">AI &amp; ML</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="sub-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title *
            </label>
            <input
              id="sub-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Solar-Tracking Servo Sunflower"
              className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="sub-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Project Description *
            </label>
            <textarea
              id="sub-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explain what your project does, how it works, and any challenge you solved..."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sub-objectives" className="block text-xs font-semibold text-slate-700 mb-1">
                Learning Objectives * (one per line)
              </label>
              <textarea
                id="sub-objectives"
                value={objectivesInput}
                onChange={(e) => setObjectivesInput(e.target.value)}
                rows={3}
                placeholder={'Calibrate light sensors\nControl a servo motor with PWM'}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="sub-components" className="block text-xs font-semibold text-slate-700 mb-1">
                Components Used * (comma-separated)
              </label>
              <textarea
                id="sub-components"
                value={componentsInput}
                onChange={(e) => setComponentsInput(e.target.value)}
                rows={3}
                placeholder="Arduino Uno, 2x LDR Sensors, SG90 Servo, Breadboard"
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Project Photo (Optional Upload)
              </span>
              {uploadedImageUrl && (
                <button
                  type="button"
                  onClick={() => setUploadedImageUrl(null)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Use Default Track Photo</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                <ResilientImage
                  src={previewSrc}
                  alt="Project preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                  {imageProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <ImagePlus className="w-4 h-4 text-blue-600" />
                  )}
                  <span>{imageProcessing ? 'Processing Image...' : 'Upload Project Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handleImageUpload(e)}
                    className="sr-only"
                  />
                </label>
                <p className="text-[11px] text-slate-500">
                  Supports PNG, JPG, or WebP. Automatically resized so it saves reliably.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="sub-code" className="block text-xs font-semibold text-slate-700 mb-1">
              Favorite Line of Code (Optional)
            </label>
            <input
              id="sub-code"
              type="text"
              value={codeHighlight}
              onChange={(e) => setCodeHighlight(e.target.value)}
              placeholder="e.g., if (distance < 20) turnRight();"
              className="w-full h-10 px-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || imageProcessing}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {submitting
                  ? 'Saving...'
                  : editingSubmission
                  ? 'Save Changes'
                  : 'Publish Project'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
