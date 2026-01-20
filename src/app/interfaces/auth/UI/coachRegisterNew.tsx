// Import Packages
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@mui/material/Link";
// Import files & shared components
import InputText from "../../../../shared/components/formFields/InputText";
// import InputFileUpload from "../../../../shared/components/formFields/InputFileUpload";
import { Link as Routerlink } from "react-router-dom";
// import profileImg from "../../../../assets/images/defaultImages/profileImg.webp";
import InputCheckbox from "../../../../shared/components/formFields/InputCheckbox";
import InputRadio from "../../../../shared/components/formFields/InputRadio";
import styles from "../auth.module.scss";
import { useCreateCoachMutation } from "../../admin/coach/service/Coach";
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";
import FileUploadInput from "../../../../shared/components/formFields/InputFileUpload";
import Loader from "../../../../shared/components/loader/Loader";
import logo from '../../../../assets/images/logo.webp'
// Import constant listsDEFAULT_RADIO_OPTIONS
import { coachingCredentials, coachingHours, credentialFileMap, } from "../../../../shared/constant";
// Import Ghost hooks
import { useGhostPostHTML } from "../../../../shared/hooks/useGhostPost";
import InputNumber from "../../../../shared/components/formFields/InputNumber";
import Dialog from "../../../../shared/components/dialog/Dialog";
import TickLoader from "../../../../shared/components/loader/TickLoader";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/button/Button";
type Credential = keyof typeof credentialFileMap | "None";
type CredentialFileField =
  | "acc_upload_file"
  | "pcc_upload_file"
  | "mcc_upload_file"
  | "emcc_upload_file"
  | "co_active_upload_file"
  | "other_upload_file";
export interface FormValues {
  // STEP 1
  first_name: string;
  middle_name: string | null | undefined;
  last_name: string;
  email: string;
  mobile: string;
  country_code: string;
  timezone: string;
  linked_url: string;
  website?: string;

  // STEP 2
  coaching_credentials: Credential[];

  coaching_hours: number | null; // ✅ REQUIRED (matches yup.required)

  coaching_experience: string | null;

  industries: string[];
  leadership_levels: string[];

  // FILE UPLOADS (conditionally required → NOT optional)
  acc_upload_file: File | string | undefined;
  pcc_upload_file: File | string | undefined;
  mcc_upload_file: File | string | undefined;
  emcc_upload_file: File | string | undefined;
  co_active_upload_file: File | string | undefined;
  other_upload_file: File | string | undefined;

  // CONDITIONAL FIELDS (IMPORTANT PATTERN)
  other_coaching_credentials: string | undefined;
  other_industries: string | undefined;

  // STEP 3
  coaching_topics: string | null;
  coaching_philosophy: string | null;
  coaching_strength: string | null;
  preferred_client: string | null;
  bio: string | null;
  comments: string | null;

  clients_situation: string[];
  coaching_style: string[];

  other_coaching_style: string | undefined;
  other_clients_situation: string | undefined;

  // STEP 4
  coaching_boundaries: string | null;
  session_rates: string[];
  anything: string | null;
  connecting_coaches: number | null;
  connecting_other_coaches: string | undefined;

  terms_conditions: boolean;
}
// -----------------------------
// Yup validation schema
// -----------------------------



const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const filePdfWithSize = () =>
  yup
    .mixed<File | FileList | string>()
    .nullable()
    .test("fileType", "Only PDF files are allowed", (value) => {
      if (!value || typeof value === "string") return true;
      const file = value instanceof File ? value : value[0];
      return file?.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 2 MB", (value) => {
      if (!value || typeof value === "string") return true;
      const file = value instanceof File ? value : value[0];
      return file?.size <= MAX_FILE_SIZE;
    });






const schema = yup
  .object()
  .transform((values) => {
    const newValues: any = { ...values };

    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === "") newValues[key] = undefined;
      if (Array.isArray(newValues[key]) && newValues[key].length === 0) {
        newValues[key] = undefined;
      }
    });

    return newValues;
  })
  .shape({
    // STEP 1
    first_name: yup.string().required("First Name is required"),
    middle_name: yup.string().nullable().notRequired(),
    last_name: yup.string().required("Last Name is required"),
    email: yup.string().email().required("Email is required"),
    linked_url: yup.string().url().required("LinkedIn URL is required"),

    // STEP 2
    coaching_credentials: yup
      .array()
      .of(yup.string())
      .min(1, "At least one credential is required")
      .required(),

    coaching_hours: yup
      .number()
      .typeError("Please select coaching hours")
      .required("Please select coaching hours"),

    // FILES
    // FILE VALIDATION ✅
    acc_upload_file: filePdfWithSize(),
    pcc_upload_file: filePdfWithSize(),
    mcc_upload_file: filePdfWithSize(),
    emcc_upload_file: filePdfWithSize(),
    co_active_upload_file: filePdfWithSize(),
    other_upload_file: filePdfWithSize(),

    // TERMS
    // terms_conditions: yup.boolean().when("$hasTerms", {
    //   is: true,
    //   then: (schema) =>
    //     schema.oneOf([true], "You must accept Terms & Conditions"),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
    terms_conditions: yup
  .boolean()
  .oneOf([true], "You must accept Terms & Conditions"),
  });


const CoachRegisterNew = () => {


  // RTK Query mutation hook
  const [createCoach, { isLoading: loadingCoachRegister }] = useCreateCoachMutation();
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  // type CredentialField = (typeof credentialFileMap)[Credential];

  // Toast message state for error notifications
  const [toast, setToast] = useState({ open: false, message: "", severity: "primary", autoHide: 6000 });
  // Success dialog state (replaces success toasts)
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const [successAction, setSuccessAction] = useState<"login" | "profile" | "none">('login');

  const navigate = useNavigate();
  const [loadTerms, setLoadTerms] = useState(false);
  // Fetch Terms & Conditions from Ghost using custom hook
  const { html: termsHtml, loading: termsLoading } = useGhostPostHTML(
    "limit=1&fields=html",
    loadTerms
  );

  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsDialogBody, setTermsDialogBody] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema, {
      context: {
        hasTerms: !!termsHtml,
      },
    }) as unknown as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: true,
    shouldFocusError: true,
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      mobile: "",
      country_code: "",
      timezone: "",
      linked_url: "",
      // image_url: null,

      coaching_credentials: [],
      coaching_hours: null,
      industries: [],
      leadership_levels: [],

      acc_upload_file: undefined,
      pcc_upload_file: undefined,
      mcc_upload_file: undefined,
      emcc_upload_file: undefined,
      co_active_upload_file: undefined,
      other_upload_file: undefined,

      other_coaching_credentials: "",
      other_industries: "",

      clients_situation: [],
      coaching_topics: "",
      coaching_philosophy: "",
      coaching_strength: "",
      bio: "",
      comments: "",
      preferred_client: "",

      coaching_style: [],
      other_coaching_style: "",
      other_clients_situation: "",
      connecting_coaches: 0,
      connecting_other_coaches: "",

      coaching_boundaries: "",
      session_rates: [],
      anything: "",
      terms_conditions: false,
    },
  });



  // const payload = {
  //       page:"",
  //       itemPerPage: "",
  //       search:"",
  //   };

  const selectedCredentials = useWatch({
    control,
    name: "coaching_credentials",
    defaultValue: [],
  });

  // Watch for checkbox changes and open modal when checked manually
  const termsChecked = useWatch({
    control,
    name: "terms_conditions",
    defaultValue: false,
  });
  useEffect(() => {
    console.log("termsChecked changed:", termsChecked, "loadTerms:", loadTerms);
    if (termsChecked && !loadTerms) {
      setLoadTerms(true);   // ✅ trigger Ghost API
      setTermsOpen(true);   // ✅ open modal
    }
  }, [termsChecked, loadTerms]);

  const watchHours = useWatch({ control, name: "coaching_hours" });
  console.log("coaching_hours (watch):", watchHours, typeof watchHours);

  useEffect(() => {
    // populate dynamic dialog body when fetched
    setTermsDialogBody(termsHtml || "<p>No terms available.</p>");
  }, [termsHtml]);

  // Scroll to top when step changes


  // Fetch coach by logInId and populate form




  useEffect(() => {
    if (!Array.isArray(selectedCredentials)) return;

    // If "None" selected → reset all
    if (selectedCredentials.includes("None")) {
      setValue("coaching_credentials", ["None"]);

      (Object.values(credentialFileMap) as readonly string[]).forEach(
        (field) => {
          // setValue(field as any, null);
          setValue(field as any, undefined, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      );

      return;
    }

    type CredentialWithFile = keyof typeof credentialFileMap;
    // ✅ FIXED: typed Object.entries
    (Object.entries(credentialFileMap) as [
      CredentialWithFile,
      (typeof credentialFileMap)[CredentialWithFile]
    ][]).forEach(([credential, field]) => {
      if (!selectedCredentials.includes(credential)) {
        setValue(field, undefined);
      }
    });
  }, [selectedCredentials, setValue]);

  console.log(errors)

  // --------------------------- Save Coach ---------------------------

  const terms = [{ label: "Accept Terms and Conditions", value: true }];

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (value instanceof File) {
        formData.append(key, value);
      }
      else if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file: File) => formData.append(key, file));
      }
      else if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      }
      else if (typeof value === "string") {
        formData.append(key, value); // existing URL
      }
      else {
        formData.append(key, value ?? "");
      }
    });

    try {
      const response = await createCoach(formData).unwrap();
      setSuccessMessage(response?.message || "Coach Registered successfully");
      setSuccessOpen(true);
    } catch (error: any) {
      setToast({
        open: true,
        message: error?.data?.message || "Something went wrong",
        severity: "error",
        autoHide: 5000,
      });
    }
  };


  return (
    <Box className="p-4  text-start" >
      <Box className={styles.container}>
        <Box className=" row align-items-center">

          <Box className="col-2">
            <Routerlink to="/auth/login">
              <img src={logo} alt="Logo" className={`${styles.logo} cursor-pointer`} />
            </Routerlink>

          </Box>

          <Box className="col-8 text-center">
            <Typography variant="h4" color="black">
              Coach Registration Form
            </Typography>
          </Box>

          <Box className="col-2" />
        </Box>


      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {(loadingCoachRegister) && (
          <div
            className={`${styles.globalLoaderOverlay} d-flex align-items-center justify-content-center`}
          >
            <Loader />
          </div>
        )}
        <Box className="py-5 px-3 d- flex justify-content-center w-100">
          <Container maxWidth="md">
            <Box className="w-100">
              <Grid container spacing={4} className="formContent">
                <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>
                  <Box className="formLeft">
                    <div className="formGroup">
                      <InputText name="first_name" label="What is your first name" placeholder="What is your first name" variant="labeled" control={control} errors={errors} required />
                    </div>
                    <div className="formGroup">
                      <InputText name="middle_name" label="What is your middle name" placeholder="What is your middle name" variant="labeled" control={control} errors={errors} />
                    </div>
                    <div className="formGroup">
                      <InputText name="last_name" label="What is your last name" placeholder="What is your last name" variant="labeled" control={control} errors={errors} required />
                    </div>
                    <div className="formGroup">
                      <InputText name="email" label="What is your email address" placeholder="What is your email address" variant="labeled" control={control} errors={errors} required />
                    </div>
                    {/* <Box className="formGroup">
                        <InputAutoComplete name=" country_code" label="Country Code" placeholder="Select Timezone" variant="labeled" control={control} errors={errors} options={countryCodes} />
                      </Box> */}
                    <div className="formGroup">
                      <InputText name="linked_url" label="Please share your LinkedIn profile" placeholder="Please share your LinkedIn profile" variant="labeled" control={control} errors={errors} required
                      />
                    </div>
                    <div className="formGroup">
                      <InputText name="website" label="Please share your website or coach profile (if available), or another link that helps us understand your practice?" placeholder="Enter Website URL" variant="labeled" control={control} errors={errors} />
                    </div>
                    <Box className="formLeft">
                      <div className="formGroup">
                        <InputCheckbox name="coaching_credentials" label="Which coaching credentials do you hold?" control={control} errors={errors} multiple required showOtherField
                          options={coachingCredentials} />
                      </div>
                      <Typography variant="body1" component="p" className="FormTitleforchechbox">
                        Please upload proof of your coaching credential(s).
                      </Typography>
                      {(Object.entries(credentialFileMap) as [
                        Credential,
                        CredentialFileField
                      ][])
                        .filter(([credential]) => Array.isArray(selectedCredentials) && selectedCredentials.includes(credential as any))
                        .map(([credential, field]) => {
                          const displayCredential = credential === "other" ? "Other" : String(credential);
                          return (
                            <div key={`${field}-upload`} className={styles.uploadLeftAlign}>
                              <FileUploadInput
                                key={`${field}-upload-input`}
                                name={field}
                                label={`Upload ${displayCredential} Certificate`}
                                control={control}
                                errors={errors}
                                accept=".pdf"
                                multiple={false}
                                showImagePreview={false}
                              />
                            </div>
                          );
                        })}
                      <div className="formGroup mt-3" >
                        <InputRadio
                          name="coaching_hours" label="Approximately how many hours of coaching have you completed?" control={control} errors={errors}
                          required
                          options={coachingHours}
                        />
                      </div>
                      <Box mt={4}>
                        <InputNumber name="coaching_experience" label=" Approximately how many years of coaching experience do you have?" placeholder="Approximately how many years of coaching experience do you have?" control={control} errors={errors} variant="labeled" />
                      </Box>
                    </Box>
                    <Box className="formRight">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InputCheckbox name="terms_conditions" control={control} errors={errors} options={terms} required />
                        <Link component="button" variant="body2" onClick={() => {
                          setLoadTerms(true);   // ✅ trigger API
                          setTermsOpen(true);  // ✅ open modal
                        }}>
                        </Link>
                      </Box>
                    </Box>
                    <Box className="submitWrapper">
                      <Button type="submit" onClick={handleSubmit(onSubmit)} label="Submit" className={styles.submitBtn} disabled={loadingCoachRegister} />
                    </Box>

                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>


      </form>


      <ToastMessage autoHideMs={toast.autoHide} open={toast.open} message={toast.message} severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })} />
      <Dialog
        open={successOpen}
        buttonPostion="center"
        content={
          <Box className={styles.successDialogContent}>
            <TickLoader />
            <Typography className={styles.successText}>
              {successMessage || "Operation successful."}
            </Typography>
          </Box>
        }

        buttons={[
          {
            label: "OK",
            variant: "contained",
            color: "primary",
            onClick: () => {
              setSuccessOpen(false);
              navigate('/auth/login');
            },
          },
        ]}
      />

      <Dialog
        open={termsOpen}
        title="Terms & Conditions"
        component={
          termsLoading ? (
            <Box className="d-flex justify-content-center p-4"><CircularProgress /></Box>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: termsDialogBody || "<p>No terms available.</p>" }} />
          )
        }
        buttons={[
          {
            label: 'Close',
            onClick: () => {
              setTermsOpen(false);
              setValue("terms_conditions", false);
            },
          },
          {
            label: 'I Agree',
            variant: 'contained',
            color: 'primary',
            onClick: () => {
              setValue("terms_conditions", true, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
              setTermsOpen(false);
            },
          },
        ]}
        onClose={() => {
          setTermsOpen(false);
          if (!termsAgreed) {
            setValue("terms_conditions", false);
          }
        }}
      />



    </Box>
  );
};

export default CoachRegisterNew;



