import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import Button from '../UI/Button';

const UpdateQuestionModal = ({ open, onClose, onUpdate, question, loading = false }) => {
    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctAnswer: '',
        level: '',
        category: ''
    });

    useEffect(() => {
        if (question) {
            setFormData({
                question: question.question || '',
                option1: question.option1 || '',
                option2: question.option2 || '',
                option3: question.option3 || '',
                option4: question.option4 || '',
                correctAnswer: question.correctAnswer || '',
                level: question.level || '',
                category: question.category || ''
            });
        }
    }, [question]);

    if (!open) return null;

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...question, ...formData });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold">Update Question</h2>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form - Scrollable Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Question */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Question <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Enter question..."
                        />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Option A"
                            value={formData.option1}
                            onChange={handleChange('option1')}
                            placeholder="Enter option A"
                            required
                        />
                        <InputField
                            label="Option B"
                            value={formData.option2}
                            onChange={handleChange('option2')}
                            placeholder="Enter option B"
                            required
                        />
                        <InputField
                            label="Option C"
                            value={formData.option3}
                            onChange={handleChange('option3')}
                            placeholder="Enter option C"
                            required
                        />
                        <InputField
                            label="Option D"
                            value={formData.option4}
                            onChange={handleChange('option4')}
                            placeholder="Enter option D"
                            required
                        />
                    </div>

                    {/* Correct Answer & Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectField
                            label="Correct Answer"
                            value={formData.correctAnswer}
                            onChange={handleChange('correctAnswer')}
                            options={[
                                { value: '', label: 'Select correct answer' },
                                { value: 'option1', label: 'Option A' },
                                { value: 'option2', label: 'Option B' },
                                { value: 'option3', label: 'Option C' },
                                { value: 'option4', label: 'Option D' }
                            ]}
                            required
                        />
                        <InputField
                            label="Level"
                            value={formData.level}
                            onChange={handleChange('level')}
                            placeholder="e.g., Basic, Intermediate"
                            required
                        />
                        <InputField
                            label="Category"
                            value={formData.category}
                            onChange={handleChange('category')}
                            placeholder="e.g., Addition"
                            required
                        />
                    </div>
                    </div>

                    {/* Footer - Fixed at bottom */}
                    <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 flex-shrink-0">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="secondary"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            icon={Save}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Question'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateQuestionModal;
