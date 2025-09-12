//
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Phone, Lock, User, MapPin, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { INDIAN_STATES, USER_TYPES } from "../utils/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const AuthPage = () => {
	const [activeTab, setActiveTab] = useState(USER_TYPES.FARMER);
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { login, register } = useAuth();
	const { t, currentLanguage } = useLanguage();

	const {
		register: registerField,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const onSubmit = async (data) => {
		setIsLoading(true);
		try {
			let userData = {
				...data,
				userType: activeTab,
				language: currentLanguage,
			};
			// Officer registration extra fields
			if (!isLogin && activeTab === USER_TYPES.OFFICER) {
				userData = {
					...userData,
					email: data.email,
					licenseNumber: data.licenseNumber,
					aadhar: data.aadhar,
					confirm_password: data.confirm_password,
				};
			}
			// Officer login fields
			if (isLogin && activeTab === USER_TYPES.OFFICER) {
				userData = {
					userType: activeTab,
					licenseNumber: data.licenseNumber,
					password: data.password,
				};
			}
			// User login fields
			if (isLogin && activeTab === USER_TYPES.FARMER) {
				userData = {
					userType: activeTab,
					phone: data.phone,
					password: data.password,
				};
			}
			// User registration fields
			if (!isLogin && activeTab === USER_TYPES.FARMER) {
				userData = {
					userType: activeTab,
					name: data.name,
					phone: data.phone,
					location: data.location,
					password: data.password,
					confirm_password: data.confirm_password,
				};
			}
			if (isLogin) {
				await login(userData);
			} else {
				await register(userData);
			}
		} catch (error) {
			console.error("Auth error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		reset();
	};

	return (
		<div className="min-h-screen gradient-bg flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-4xl"
			>
				{/* Header */}
				<div className="text-center mb-8">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="flex items-center justify-center gap-3 mb-4"
					>
						<div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
							<Sprout className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								{t("appName")}
							</h1>
							<p className="text-gray-600 dark:text-gray-400">
								{t("appTagline")}
							</p>
						</div>
					</motion.div>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="text-lg text-gray-700 dark:text-gray-300"
					>
						{t("welcomeMessage")}
					</motion.p>
				</div>

				{/* Auth Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
				>
					{/* User Type Tabs */}
					<div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-8">
						<button
							onClick={() => setActiveTab(USER_TYPES.FARMER)}
							className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
								activeTab === USER_TYPES.FARMER
									? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
									: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							👨‍🌾 {t("farmer")}
						</button>
						<button
							onClick={() => setActiveTab(USER_TYPES.OFFICER)}
							className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
								activeTab === USER_TYPES.OFFICER
									? "bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm"
									: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							👨‍💼 {t("agriOfficer")}
						</button>
					</div>

					{/* Auth Mode Toggle */}
					<div className="text-center mb-6">
						<p className="text-gray-600 dark:text-gray-400">
							{isLogin
								? "Don't have an account?"
								: "Already have an account?"}
							<button
								onClick={toggleMode}
								className="ml-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
							>
								{isLogin ? t("createAccount") : t("signIn")}
							</button>
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="grid md:grid-cols-2 gap-6">
							{/* Login Section */}
							<div>
								<h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
									<Lock className="w-5 h-5" />
									{isLogin ? t("signIn") : t("createAccount")}
								</h3>

								{/* Name for registration (both user and officer) */}
								{!isLogin && (
									<Input
										label={t("fullName")}
										leftIcon={<User className="w-5 h-5" />}
										{...registerField("name", {
											required: !isLogin
												? "Name is required"
												: false,
										})}
										error={errors.name?.message}
										className="mb-4"
									/>
								)}
								{/* Officer registration: email, licenseNumber, aadhar */}
								{!isLogin &&
									activeTab === USER_TYPES.OFFICER && (
										<>
											<Input
												label={t("email") || "Email"}
												type="email"
												leftIcon={
													<User className="w-5 h-5" />
												}
												{...registerField("email", {
													required:
														"Email is required",
												})}
												error={errors.email?.message}
												className="mb-4"
											/>
											<Input
												label={
													t("licenseNumber") ||
													"License Number"
												}
												leftIcon={
													<User className="w-5 h-5" />
												}
												{...registerField(
													"licenseNumber",
													{
														required:
															"License Number is required",
													}
												)}
												error={
													errors.licenseNumber
														?.message
												}
												className="mb-4"
											/>
											<Input
												label={t("aadhar") || "Aadhar"}
												leftIcon={
													<User className="w-5 h-5" />
												}
												{...registerField("aadhar", {
													required:
														"Aadhar is required",
												})}
												error={errors.aadhar?.message}
												className="mb-4"
											/>
										</>
									)}
								{/* Officer login: licenseNumber */}
								{isLogin &&
									activeTab === USER_TYPES.OFFICER && (
										<Input
											label={
												t("licenseNumber") ||
												"License Number"
											}
											leftIcon={
												<User className="w-5 h-5" />
											}
											{...registerField("licenseNumber", {
												required:
													"License Number is required",
											})}
											error={
												errors.licenseNumber?.message
											}
											className="mb-4"
										/>
									)}

								{/* Phone for user login/registration */}
								{(activeTab === USER_TYPES.FARMER ||
									!isLogin) && (
									<Input
										label={t("phoneNumber")}
										type="tel"
										leftIcon={<Phone className="w-5 h-5" />}
										placeholder="+91 98765 43210"
										{...registerField("phone", {
											required:
												activeTab === USER_TYPES.FARMER
													? "Phone number is required"
													: false,
											pattern: {
												value: /^[+]?[1-9][\d\s\-()]{7,15}$/,
												message: "Invalid phone number",
											},
										})}
										error={errors.phone?.message}
										className="mb-4"
									/>
								)}

								{/* Location for registration (both user and officer) */}
								{!isLogin && (
									<div className="mb-4">
										<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
											{t("location")}
										</label>
										<div className="relative">
											<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
											<select
												{...registerField("location", {
													required: !isLogin
														? "Location is required"
														: false,
												})}
												className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
											>
												<option value="">
													{t("selectState")}
												</option>
												{INDIAN_STATES.map((state) => (
													<option
														key={state.value}
														value={state.value}
													>
														{currentLanguage ===
														"ml"
															? state.labelMl
															: state.label}
													</option>
												))}
											</select>
										</div>
										{errors.location && (
											<p className="mt-1 text-sm text-red-600 dark:text-red-400">
												{errors.location.message}
											</p>
										)}
									</div>
								)}

								{/* Password for all logins/registrations */}
								<Input
									label={t("password")}
									type={showPassword ? "text" : "password"}
									leftIcon={<Lock className="w-5 h-5" />}
									rightIcon={
										<button
											type="button"
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
										>
											{showPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									}
									placeholder={
										isLogin
											? "Enter your password"
											: "Create a strong password"
									}
									{...registerField("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message:
												"Password must be at least 6 characters",
										},
									})}
									error={errors.password?.message}
									className="mb-4"
								/>
								{/* Confirm password for registration (both user and officer) */}
								{!isLogin && (
									<Input
										label={
											t("confirmPassword") ||
											"Confirm Password"
										}
										type={
											showPassword ? "text" : "password"
										}
										leftIcon={<Lock className="w-5 h-5" />}
										{...registerField("confirm_password", {
											required:
												"Please confirm your password",
										})}
										error={errors.confirm_password?.message}
										className="mb-4"
									/>
								)}

								{!isLogin && (
									<div className="flex items-start gap-2 mb-4">
										<input
											type="checkbox"
											className="mt-1"
											{...registerField("agreeToTerms", {
												required: !isLogin
													? "You must agree to the terms"
													: false,
											})}
										/>
										<label className="text-sm text-gray-600 dark:text-gray-400">
											{t("agreeToTerms")}
										</label>
										{errors.agreeToTerms && (
											<p className="text-sm text-red-600 dark:text-red-400">
												{errors.agreeToTerms.message}
											</p>
										)}
									</div>
								)}

								<Button
									type="submit"
									className="w-full"
									loading={isLoading}
									disabled={isLoading}
								>
									{isLogin ? t("signIn") : t("createAccount")}
								</Button>
							</div>

							{/* Features Section */}
							<div className="bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 rounded-xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
									🌱 Smart Farming Features
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Voice Assistant
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Ask questions in Malayalam or
												English
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Image Analysis
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												AI-powered crop disease
												detection
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Weather Insights
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Real-time weather and farming
												tips
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												Market Prices
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Live crop prices and trends
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</div>
	);
};

export default AuthPage;

//import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Sprout, Phone, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react'
// import { useForm } from 'react-hook-form'
// import { useAuth } from '../hooks/useAuth'
// import { useLanguage } from '../context/LanguageContext'
// import { INDIAN_STATES, USER_TYPES } from '../utils/constants'
// import Button from '../components/ui/Button'
// import Input from '../components/ui/Input'
// import toast from 'react-hot-toast'

// const AuthPage = () => {
//   const [activeTab, setActiveTab] = useState(USER_TYPES.FARMER)
//   const [isLogin, setIsLogin] = useState(true)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const { login, register } = useAuth()
//   const { t, currentLanguage } = useLanguage()

//   const { register: registerField, handleSubmit, formState: { errors }, reset, watch } = useForm()

//   const onSubmit = async (data) => {
//     setIsLoading(true)

//     // Simulate realistic loading time
//     await new Promise(resolve => setTimeout(resolve, 1500))

//     try {
//       const userData = {
//         ...data,
//         userType: activeTab,
//         language: currentLanguage,
//         id: 'user-' + Date.now() // Generate unique ID
//       }

//       if (isLogin) {
//         // Mimic successful login
//         toast.success('Login successful! Welcome back.')

//         // Try to call the actual login function, but bypass on error
//         try {
//           await login(userData)
//         } catch (error) {
//           console.log('Login function bypassed - proceeding with mock login')
//           // Continue as if login was successful
//         }
//       } else {
//         // Mimic successful registration
//         toast.success('Account created successfully! Please sign in.')

//         // Try to call the actual register function, but bypass on error
//         try {
//           await register(userData)
//         } catch (error) {
//           console.log('Registration function bypassed - proceeding with mock registration')
//           // Continue as if registration was successful
//         }

//         // Switch to login mode after successful registration
//         setIsLogin(true)
//         reset()
//       }

//     } catch (error) {
//       // Fallback: always show success even if something goes wrong
//       console.log('Auth bypassed:', error)
//       const successMessage = isLogin
//         ? 'Login successful! Welcome back.'
//         : 'Account created successfully!'
//       toast.success(successMessage)

//       if (!isLogin) {
//         // Switch to login mode after registration
//         setIsLogin(true)
//         reset()
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const toggleMode = () => {
//     setIsLogin(!isLogin)
//     reset()
//   }

//   return (
//     <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-4xl"
//       >
//         {/* Header */}
//         <div className="text-center mb-8">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2 }}
//             className="flex items-center justify-center gap-3 mb-4"
//           >
//             <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Sprout className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                 {t('appName')}
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {t('appTagline')}
//               </p>
//             </div>
//           </motion.div>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             className="text-lg text-gray-700 dark:text-gray-300"
//           >
//             {t('welcomeMessage')}
//           </motion.p>
//         </div>

//         {/* Auth Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
//         >
//           {/* User Type Tabs */}
//           <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-8">
//             <button
//               onClick={() => setActiveTab(USER_TYPES.FARMER)}
//               className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
//                 activeTab === USER_TYPES.FARMER
//                   ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
//                   : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
//               }`}
//             >
//               👨‍🌾 {t('farmer')}
//             </button>
//             <button
//               onClick={() => setActiveTab(USER_TYPES.OFFICER)}
//               className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
//                 activeTab === USER_TYPES.OFFICER
//                   ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
//                   : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
//               }`}
//             >
//               👨‍💼 {t('agriOfficer')}
//             </button>
//           </div>

//           {/* Auth Mode Toggle */}
//           <div className="text-center mb-6">
//             <p className="text-gray-600 dark:text-gray-400">
//               {isLogin ? "Don't have an account?" : "Already have an account?"}
//               <button
//                 onClick={toggleMode}
//                 className="ml-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
//               >
//                 {isLogin ? t('createAccount') : t('signIn')}
//               </button>
//             </p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Login Section */}
//               <div>
//                 <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
//                   <Lock className="w-5 h-5" />
//                   {isLogin ? t('signIn') : t('createAccount')}
//                 </h3>

//                 {!isLogin && (
//                   <Input
//                     label={t('fullName')}
//                     leftIcon={<User className="w-5 h-5" />}
//                     {...registerField('name', {
//                       required: !isLogin ? 'Name is required' : false
//                     })}
//                     error={errors.name?.message}
//                     className="mb-4"
//                   />
//                 )}

//                 <Input
//                   label={t('phoneNumber')}
//                   type="tel"
//                   leftIcon={<Phone className="w-5 h-5" />}
//                   placeholder="+91 98765 43210"
//                   {...registerField('phone', {
//                     required: 'Phone number is required',
//                     pattern: {
//                       value: /^[+]?[1-9][\d\s\-\(\)]{7,15}$/,
//                       message: 'Invalid phone number'
//                     }
//                   })}
//                   error={errors.phone?.message}
//                   className="mb-4"
//                 />

//                 {!isLogin && (
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       {t('location')}
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <select
//                         {...registerField('location', {
//                           required: !isLogin ? 'Location is required' : false
//                         })}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
//                       >
//                         <option value="">{t('selectState')}</option>
//                         {INDIAN_STATES.map(state => (
//                           <option key={state.value} value={state.value}>
//                             {currentLanguage === 'ml' ? state.labelMl : state.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     {errors.location && (
//                       <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//                         {errors.location.message}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <Input
//                   label={t('password')}
//                   type={showPassword ? 'text' : 'password'}
//                   leftIcon={<Lock className="w-5 h-5" />}
//                   rightIcon={
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   }
//                   placeholder={isLogin ? "Enter your password" : "Create a strong password"}
//                   {...registerField('password', {
//                     required: 'Password is required',
//                     minLength: {
//                       value: 6,
//                       message: 'Password must be at least 6 characters'
//                     }
//                   })}
//                   error={errors.password?.message}
//                   className="mb-4"
//                 />

//                 {!isLogin && (
//                   <div className="flex items-start gap-2 mb-4">
//                     <input
//                       type="checkbox"
//                       className="mt-1"
//                       {...registerField('agreeToTerms', {
//                         required: !isLogin ? 'You must agree to the terms' : false
//                       })}
//                     />
//                     <label className="text-sm text-gray-600 dark:text-gray-400">
//                       {t('agreeToTerms')}
//                     </label>
//                     {errors.agreeToTerms && (
//                       <p className="text-sm text-red-600 dark:text-red-400">
//                         {errors.agreeToTerms.message}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   loading={isLoading}
//                   disabled={isLoading}
//                 >
//                   {isLogin ? t('signIn') : t('createAccount')}
//                 </Button>
//               </div>

//               {/* Features Section */}
//               <div className="bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-900/20 dark:to-green-900/20 rounded-xl p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   🌱 Smart Farming Features
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="flex items-start gap-3">
//                     <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Voice Assistant</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Ask questions in Malayalam or English</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Image Analysis</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered crop disease detection</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Weather Insights</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Real-time weather and farming tips</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Market Prices</p>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Live crop prices and trends</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }

// export default AuthPage
