import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaThermometerHalf, FaWeight, FaRuler, FaPills, FaAllergies, FaSmoking, FaWineGlassAlt, FaRunning } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown'; 

const HealthChecker = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Updated state to match backend DTO
    const [answers, setAnswers] = useState({
        name: 'Health Assessment',
        email: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        bloodPressure: '',
        cholesterol: '',
        medications: '',
        allergies: '',
        smoker: '',
        alcohol: '',
        exercise: '',
        healthConditions: [], // Changed to match backend
        additionalNotes: ''
    });

    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (condition) => {
        setAnswers(prev => ({
            ...prev,
            healthConditions: prev.healthConditions.includes(condition)
                ? prev.healthConditions.filter(c => c !== condition)
                : [...prev.healthConditions, condition]
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Submit to backend API using Fetch
    const submitToBackend = async () => {
        setIsSubmitting(true);
        setApiError(null);
        
        try {
            // Prepare data in backend format
            const payload = {
                ...answers,
                // Convert to numbers
                age: Number(answers.age),
                height: Number(answers.height),
                weight: Number(answers.weight)
            };
            
            // Call backend API
            const response = await fetch(
                'http://localhost:5137/api/DiagnosticTest/submit',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setResults(data);
            setStep(7); // Go to results step
        } catch (error) {
            console.error('API Error:', error);
            setApiError('Failed to process your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaHeartbeat className="mr-2 text-red-500" /> Basic Information
                        </h2>
                        {/* Added email field */}
                        <div>
                            <label className="block text-lg mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={answers.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={answers.age}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                min="18"
                                max="120"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Gender</label>
                            <select
                                name="gender"
                                value={answers.gender}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                required
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other/Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaWeight className="mr-2 text-blue-500" /> Body Measurements
                        </h2>
                        <div>
                            <label className="block text-lg mb-2">Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={answers.height}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                min="100"
                                max="250"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={answers.weight}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                min="30"
                                max="200"
                                required
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaThermometerHalf className="mr-2 text-orange-500" /> Health Metrics
                        </h2>
                        <div>
                            <label className="block text-lg mb-2">Blood Pressure (e.g. 120/80)</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                value={answers.bloodPressure}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Systolic/Diastolic"
                            />
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Cholesterol Level</label>
                            <select
                                name="cholesterol"
                                value={answers.cholesterol}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select</option>
                                <option value="normal">Normal</option>
                                <option value="borderline">Borderline High</option>
                                <option value="high">High</option>
                                <option value="unknown">Don't Know</option>
                            </select>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaPills className="mr-2 text-purple-500" /> Medications & Allergies
                        </h2>
                        <div>
                            <label className="block text-lg mb-2">Current Medications</label>
                            <input
                                type="text"
                                name="medications"
                                value={answers.medications}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="List any medications you take regularly"
                            />
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Allergies</label>
                            <input
                                type="text"
                                name="allergies"
                                value={answers.allergies}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="List any allergies you have"
                            />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaSmoking className="mr-2 text-gray-500" /> Lifestyle Factors
                        </h2>
                        <div>
                            <label className="block text-lg mb-2">Do you smoke?</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="smoker"
                                        value="yes"
                                        checked={answers.smoker === 'yes'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="smoker"
                                        value="no"
                                        checked={answers.smoker === 'no'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    No
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Alcohol Consumption</label>
                            <select
                                name="alcohol"
                                value={answers.alcohol}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select</option>
                                <option value="none">None</option>
                                <option value="occasional">Occasional</option>
                                <option value="moderate">Moderate</option>
                                <option value="heavy">Heavy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-lg mb-2">Exercise Frequency</label>
                            <select
                                name="exercise"
                                value={answers.exercise}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select</option>
                                <option value="none">None</option>
                                <option value="light">1-2 times per week</option>
                                <option value="moderate">3-4 times per week</option>
                                <option value="heavy">5+ times per week</option>
                            </select>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <FaHeartbeat className="mr-2 text-red-500" /> Health Conditions
                        </h2>
                        <p className="text-lg">Select any conditions you've been diagnosed with:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                'Diabetes',
                                'Hypertension',
                                'Heart Disease',
                                'Asthma',
                                'Arthritis',
                                'Depression',
                                'Anxiety',
                                'High Cholesterol',
                                'Thyroid Disorder',
                                'Cancer'
                            ].map(condition => (
                                <label key={condition} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={answers.healthConditions.includes(condition.toLowerCase())}
                                        onChange={() => handleCheckboxChange(condition.toLowerCase())}
                                        className="h-5 w-5"
                                    />
                                    <span>{condition}</span>
                                </label>
                            ))}
                        </div>
                        {/* Added additional notes field */}
                        <div>
                            <label className="block text-lg mb-2">Additional Notes</label>
                            <textarea
                                name="additionalNotes"
                                value={answers.additionalNotes}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg"
                                rows="3"
                                placeholder="Any other health information you'd like to share"
                            ></textarea>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">Your Health Assessment</h2>

                        {/* Health Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border p-4 rounded-lg">
                                    <p className="font-medium">Age</p>
                                    <p className="text-lg font-bold">{answers.age}</p>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <p className="font-medium">Gender</p>
                                    <p className="text-lg font-bold">{answers.gender}</p>
                                </div>
                                <div className="border p-4 rounded-lg">
                                    <p className="font-medium">BMI</p>
                                    <p className="text-lg font-bold">
                                        {(answers.weight / ((answers.height / 100) ** 2)).toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* AI Evaluation */}
                        {results && results.aiEvaluation && (
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold mb-4">AI Health Evaluation</h3>
                                <div className="prose max-w-none">
                                    <ReactMarkdown>{results.aiEvaluation}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Next Steps */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
                            <div className="space-y-4">
                                <button className="w-full bg-lime-600 text-white py-3 rounded-lg hover:bg-lime-700">
                                    View Recommended Insurance Plans
                                </button>
                                <button className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700">
                                    Connect with a Health Advisor
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                                >
                                    Start New Assessment
                                </button>
                            </div>

                            {/* Login prompt */}
                            <div className="mt-6 p-4 bg-orange-50 border-l-4 border-yellow-400 rounded">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-yellow-800">Want more information?</h4>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                To access detailed insurance plan options, personalized health advice,
                                                or to save your results for future reference, please log in to your account.
                                            </p>
                                            <div className="mt-4">
                                                <button
                                                    onClick={() => navigate('/login')}
                                                    className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
                                                >
                                                    Log In / Sign Up
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Checker</h1>
                    <p className="text-xl text-gray-600">
                        Complete this assessment to receive personalized health and insurance recommendations
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Progress bar */}
                    {step < 7 && (
                        <div className="bg-gray-200 h-2">
                            <div
                                className="bg-blue-600 h-2"
                                style={{ width: `${(step / 6) * 100}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
                        {/* Display API error if any */}
                        {apiError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                {apiError}
                            </div>
                        )}
                        
                        {renderStep()}

                        {step <= 6 && (
                            <div className="mt-8 flex justify-between">
                                <button
                                    onClick={prevStep}
                                    disabled={step === 1 || isSubmitting}
                                    className={`px-6 py-2 rounded-lg ${step === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={step === 6 ? submitToBackend : nextStep}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {isSubmitting ? 'Processing...' : 
                                     step === 6 ? 'Get Results' : 'Next'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthChecker;