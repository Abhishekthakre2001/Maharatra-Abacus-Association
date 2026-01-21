import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const UpdateQuestionModal = ({ open, onClose, onUpdate, question, loading = false }) => {
    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        correctoption: '',
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
                correctoption: question.correctoption || '',
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
        <Modal
            open={open}
            onClose={onClose}
            title="Update Question"
            width="max-w-3xl"
            footer={
                <div className="flex justify-end gap-3">
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
                        onClick={handleSubmit}
                    >
                        {loading ? 'Updating...' : 'Update Question'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                {/* Question */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Question <span className="text-red-500">*</span>
                    </label>
                    <InputField
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

                {/* Correct Answer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                        label="Correct Answer"
                        value={formData.correctoption}
                        onChange={handleChange('correctoption')}
                        options={[
                            { value: '', label: 'Select correct answer' },
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '4', label: '4' }
                        ]}
                        required
                    />
                </div>
            </div>
        </Modal>
    );
};

export default UpdateQuestionModal;