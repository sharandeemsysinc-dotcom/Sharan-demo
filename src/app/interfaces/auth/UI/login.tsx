// Import Packages
import React, { useState, useEffect } from "react";
import { Box, Card, Typography, Stack, Slide } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, type Resolver } from "react-hook-form";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import Icons
import BackIcon from '@mui/icons-material/ArrowLeftOutlined';

// Import Files
import styles from "../auth.module.scss";
import { useLoginMutation, useEmailVerificationMutation } from "../services/loginService";
import { setCredentials } from "../../../stores/authSlice";
import InputText from "../../../../shared/components/formFields/InputText";
import Button from "../../../../shared/components/button/Button";
import OtpInput from "../../../../shared/components/formFields/InputOtp";
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";

// Import Images
import logo from "../../../../assets/images/logo.webp";

interface LoginFormData {
  email: string;
  secret_code: string | undefined;
}

const schema = yup.object({
  email: yup.string().required("Email is required").email("Enter valid email").defined(),
  secret_code: yup
    .string()
    .transform((v) => (v === null ? undefined : v))
    .optional()
    .when("$secretStep", {
      is: true,
      then: (s) => s.required("Enter secret code"),
    }),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [secretStep, setSecretStep] = useState(false);
  const [emailEntered, setEmailEntered] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isOtpTouched, setIsOtpTouched] = useState(false);
  const [shouldValidateEmail, setShouldValidateEmail] = useState(false);
  const [showOtpError, setShowOtpError] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    clearErrors,
    resetField,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema) as unknown as Resolver<LoginFormData>,
    context: { secretStep },
    mode: "onChange",
  });

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [sendCode, { isLoading: isSendLoading }] = useEmailVerificationMutation();

  const [toast, setToast] = useState({ open: false, message: "", severity: "primary" });

  // Reset OTP touch state when going back to email step
  useEffect(() => {
    if (!secretStep) {
      setIsOtpTouched(false);
      setShouldValidateEmail(false);
      setShowOtpError(false);
    }
  }, [secretStep]);

  const submitForm = async (data: LoginFormData) => {
    if (!secretStep) {
      setEmailEntered(data.email);

      try {
        const response = await sendCode({ email: data.email });

        if (response?.data?.status) {
          setToast({ open: true, message: response.data.message, severity: "success", });
          // Slide only after success
          setSecretStep(true);
        } else {
          setToast({ open: true, message: "Failed to send secret code", severity: "error", });
        }
      } catch (error) {
        setToast({ open: true, message: "Failed to send secret code", severity: "error", });
      }

      return;
    }

    setShowOtpError(true);
    const isValid = await trigger("secret_code");

    if (!isValid) {
      return;
    }

    const payload = {
      email: data.email.trim(),
      secret_code: data.secret_code,
    };

    try {
      const apiResponse: any = await login(payload);
      const res = apiResponse?.data;

      if (res?.status) {
        const userData = {
          userId: res?.data.user?.id || '',
          loginId: res?.data?.login_id || '',
          accessToken: res?.data.access_token || '',
          refreshToken: res?.data.refresh_token || '',
          scope: res?.data.user?.role_name || ''
        };
        dispatch(setCredentials(userData));
        setToast({ open: true, message: res?.data?.message, severity: "success" });
        if (userData.scope === "Admin") navigate("/admin/staff");
        else if (userData.scope === "Staff") navigate("/staff/client");
        else if (userData.scope === "Coach") navigate("/coach/client");
        else navigate("/client");
      } else {
        setToast({ open: true, message: res?.data?.message || "Invalid secret code", severity: "error" });
        setValue("secret_code", "");
      }
    } catch (error) {
      setToast({ open: true, message: "Login failed", severity: "error" });
      setValue("secret_code", "");
    }
  };

  const handleGetCode = async () => {
    // Set that we should validate email (for empty or invalid email)
    setShouldValidateEmail(true);
    setIsEmailTouched(true);

    // Validate email first
    const isValid = await trigger("email");
    if (!isValid) return;

    // Get the current email value
    const email = watch("email");

    if (!email) return;

    // Send code in background
    try {
      const response = await sendCode({ email: email });
      if (response?.data?.status) {
        setToast({ open: true, message: response?.data?.message, severity: "success" });
        setEmailEntered(email);
        setSecretStep(true);
        // Reset OTP touch state when entering OTP step
        setIsOtpTouched(false);
        setShowOtpError(false);
      } else {
        setToast({ open: true, message: "Failed to send secret code", severity: "error" });
      }
    } catch (error) {
      setToast({ open: true, message: "Failed to send secret code", severity: "error" });
    }
  };

  const handleBack = () => {
    // Clear email field
    resetField("email", { defaultValue: "" });
    // Clear OTP field
    setValue("secret_code", "");
    // Clear all validation errors
    clearErrors();
    // Reset touch states
    setIsEmailTouched(false);
    setIsOtpTouched(false);
    setShouldValidateEmail(false);
    setShowOtpError(false);
    // Clear entered email
    setEmailEntered("");
    // Go back to email step
    setSecretStep(false);
  };

  // Handle email change
  const handleEmailChange = (value: string) => {
    setValue("email", value);
    if (!isEmailTouched && value) {
      setIsEmailTouched(true);
    }
    // Trigger validation if touched and field has value
    if ((isEmailTouched || shouldValidateEmail) && value) {
      trigger("email");
    }
  };

  // Create custom errors object that only shows errors when touched or when validation is forced
  const getEmailErrors = () => {
    if (!isEmailTouched && !shouldValidateEmail) {
      return {}; // Return empty object when not touched and not forced to validate
    }
    return errors; // Return actual errors when touched or forced
  };

  return (
    <Box className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        {secretStep && (
          <Button
            color="white"
            className={`${styles.back} btn`}
            onClick={handleBack}
          >
            <BackIcon />Back
          </Button>
        )}

        <img src={logo} alt="logo" width={110} height={110} className={styles.logoImage} />

        <Typography variant="h6" className={styles.subHeading}>
          Welcome to Alefitt
        </Typography>

        <form noValidate onSubmit={handleSubmit(submitForm)}>
          <Stack spacing={3} mt={3} mb={2}>
            {/* Email Input - Hide when in secretStep */}
            <Slide
              direction="left"
              in={!secretStep}
              mountOnEnter
              unmountOnExit
              timeout={300}
            >
              <Box>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      size="normal"
                      className={styles.customInput}
                      name="email"
                      label="Email"
                      placeholder="Enter email"
                      value={field.value}
                      onChange={(e: any) => handleEmailChange(e.target.value)}
                      errors={getEmailErrors()} // Pass filtered errors
                      required
                    />
                  )}
                />
              </Box>
            </Slide>

            {/* Secret Code - Show when in secretStep */}
            <Slide
              direction="right"
              in={secretStep}
              mountOnEnter
              unmountOnExit
              timeout={300}
            >
              <Box>
                <Typography color="var(--white-main)" variant="body2" mb={1}>
                  Secret Code
                </Typography>
                <Controller
                  name="secret_code"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <OtpInput
                        value={field.value || ""}
                        onChange={(val) => {
                          setValue("secret_code", val);

                          // Set touched when there's value
                          if (!isOtpTouched && val) {
                            setIsOtpTouched(true);
                          }

                          // Trigger validation based on conditions
                          if (showOtpError || val.length === 6) {
                            trigger("secret_code");
                          }
                        }}
                        length={6}
                      />
                      {/* Only show error if showOtpError is true */}
                      {showOtpError && fieldState.error && (
                        <Typography color="error" variant="caption">
                          {fieldState.error.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
                {emailEntered && (
                  <Typography variant="caption" color="var(--white-main)" mt={1} display="block">
                    Code sent to: <strong>{emailEntered}</strong>
                  </Typography>
                )}
              </Box>
            </Slide>
          </Stack>

          <Stack direction="row" spacing={2} mt={2}>
            {!secretStep ? (
              <Button
                className={styles.loginButton}
                label={isSendLoading ? "Sending..." : "Get Code"}
                type="button"
                variant="contained"
                onClick={handleGetCode}
                disabled={isSendLoading}
              />
            ) : (
              <Button
                className={styles.loginButton}
                label={isLoginLoading ? "Logging in..." : "Login"}
                type="submit"
                variant="contained"
                disabled={isLoginLoading}
              />
            )}
          </Stack>
        </form>

        {/* Registration links - Hide when in secretStep */}
        <Slide
          direction="up"
          in={!secretStep}
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="var(--white-main)" textAlign="center" mt={2}>
              New? Register as <span className={styles.register} onClick={() => navigate('/auth/coach/register')} >Coach</span> or <span className={styles.register} onClick={() => navigate('/auth/client/register')}>Client</span>
            </Typography>
          </Box>
        </Slide>
      </Card>

      <ToastMessage open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} />
    </Box>
  );
};

export default LoginPage;