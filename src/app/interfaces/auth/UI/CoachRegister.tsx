// Import Packages
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useLocation, useNavigate, useParams } from "react-router-dom";

// Import files & shared components
import Stepper from "../../../../shared/components/stepper/Stepper";
import InputText from "../../../../shared/components/formFields/InputText";
// import InputFileUpload from "../../../../shared/components/formFields/InputFileUpload";

// import profileImg from "../../../../assets/images/defaultImages/profileImg.webp";
import InputCheckbox from "../../../../shared/components/formFields/InputCheckbox";
import InputRadio from "../../../../shared/components/formFields/InputRadio";
import styles from "../auth.module.scss";
import { useCreateCoachMutation, useGetCoachByIdMutation, useUpdateCoachMutation, } from "../../admin/coach/service/Coach";
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";
import FileUploadInput from "../../../../shared/components/formFields/InputFileUpload";
import Loader from "../../../../shared/components/loader/Loader";
import logo from '../../../../assets/images/logo.webp'
import InputAutoComplete from "../../../../shared/components/formFields/InputAutoComplete";
import InputTextArea from "../../../../shared/components/formFields/InputTextArea";
// Import constant lists
import { coachingCredentials, coachingHours, industriesList, leadershipLevels, countries, clientSituations, sessionRates, coachingStyle, TIMEZONES, credentialFileMap, DEFAULT_RADIO_OPTIONS } from "../../../../shared/constant";
import CountryCode from "../../../../shared/components/formFields/countryCode/CountryCode";
// Import Ghost hooks
import { useGhostPostHTML } from "../../../../shared/hooks/useGhostPost";
import InputNumber from "../../../../shared/components/formFields/InputNumber";
import Dialog from "../../../../shared/components/dialog/Dialog";
import TickLoader from "../../../../shared/components/loader/TickLoader";
type Credential = keyof typeof credentialFileMap | "None";

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

  coaching_hours: undefined | number; // ✅ REQUIRED (matches yup.required)

  coaching_experience: string | null;

  industries: string[];
  leadership_levels: string[];

  // FILE UPLOADS (conditionally required → NOT optional)
  acc_upload_file: File | undefined;
  pcc_upload_file: File | undefined;
  mcc_upload_file: File | undefined;
  emcc_upload_file: File | undefined;
  co_active_upload_file: File | undefined;
  other_upload_file: File | undefined;

  // CONDITIONAL FIELDS (IMPORTANT PATTERN)
  other_coaching_credentials: string | undefined;
  other_industries: string | undefined;

  // STEP 3
  coaching_topics: string | null;
  coaching_philosophy: string | null;
  coaching_strength: string | null;
  preferred_client: string | null;
  bio: string | null;

  clients_situation: string[];
  coaching_style: string[];

  other_coaching_style: string | undefined;
  other_clients_situation: string | undefined;

  // STEP 4
  coaching_boundaries: string | null;
  session_rates: string[];
  collaboration_interest: string | null;
  connecting_coaches: number | null;
  connecting_other_coaches: string | undefined;

  terms_conditions: boolean;
}
// -----------------------------
// Yup validation schema
// -----------------------------



const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const requiredFileWithSize = (requiredMsg: string) =>
  yup
    .mixed<File[] | File | FileList>()
    .nullable()
    .test("required", requiredMsg, (value) => {
      if (!value) return false;

      if (Array.isArray(value)) return value.length > 0;
      if (value instanceof FileList) return value.length > 0;
      return value instanceof File;
    })
    .test(
      "fileSize",
      "File size must be less than 2 MB",
      (value) => {
        if (!value) return true;

        let file: File | undefined;

        if (Array.isArray(value)) file = value[0];
        else if (value instanceof FileList) file = value[0];
        else file = value;

        if (!file) return true;

        return file.size <= MAX_FILE_SIZE;
      }
    );


const schema = yup.object().shape({
  // ---------------- STEP 1 ----------------
  first_name: yup.string().required("First Name is required"),
  middle_name: yup.string().nullable().notRequired(),
  last_name: yup.string().required("Last Name is required"),

  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),

  country_code: yup.string().nullable().notRequired(),

  mobile: yup
    .string()
    .nullable().notRequired(),

  linked_url: yup
    .string()
    .url("Enter a valid LinkedIn URL")
    .required("LinkedIn URL is required"),

  timezone: yup.string().required("Time zone is required"),

  // image_url: yup.mixed().nullable(),



  // ---------------- STEP 2 ----------------
  coaching_credentials: yup
    .array()
    .of(yup.string())
    .min(1, "At least one credential is required")
    .required(),
  other_coaching_credentials: yup
    .string()
    .notRequired() // ✅ IMPORTANT
    .when("coaching_credentials", {
      is: (val: string[]) => val?.includes("other"),
      then: (schema) =>
        schema
          .required("Please specify Other coaching credential")
          .min(2)
          .trim(),
    }),

  // ================= FILE UPLOAD VALIDATION =================

  // ICF ACC
  // ICF ACC
acc_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("ICF ACC"),
    then: () =>
      requiredFileWithSize("ICF ACC certificate is required"),
  }),

// ICF PCC
pcc_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("ICF PCC"),
    then: () =>
      requiredFileWithSize("ICF PCC certificate is required"),
  }),

// ICF MCC
mcc_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("ICF MCC"),
    then: () =>
      requiredFileWithSize("ICF MCC certificate is required"),
  }),

// EMCC
emcc_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("EMCC"),
    then: () =>
      requiredFileWithSize("EMCC certificate is required"),
  }),

// Co-Active (CTI)
co_active_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("Co-Active"),
    then: () =>
      requiredFileWithSize("Co-Active (CTI) certificate is required"),
  }),

// Other
other_upload_file: yup
  .mixed<File>()
  .notRequired()
  .when("coaching_credentials", {
    is: (val: string[]) => val?.includes("other"),
    then: () =>
      requiredFileWithSize("Other certificate is required"),
  }),



  coaching_hours: yup
    .number()
    .typeError("Please select coaching hours")
    .required("Please select coaching hours"),

  coaching_style: yup
    .array()
    .of(yup.string())
    .min(1, "At least one style is required")
    .required(),
  other_coaching_style: yup.string().when("coaching_style", {
    is: (val: string[]) => val?.includes("other"),
    then: (schema) =>
      schema
        .required("Please specify other coaching style")
        .min(2, "Must be at least 2 characters")
        .trim(),
    otherwise: (schema) => schema.notRequired(),
  }),

  coaching_experience: yup.string().nullable(),

  industries: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one industry")
    .required(),
  other_industries: yup.string().when("industries", {
    is: (val: string[]) => val?.includes("other"),
    then: (schema) =>
      schema
        .required("Please specify Other industry")
        .min(2)
        .trim(),
  }),

  leadership_levels: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one leadership level")
    .required(),

  // ---------------- STEP 3 ----------------
  coaching_topics: yup.string().nullable(),
  coaching_philosophy: yup.string().nullable(),
  coaching_strength: yup.string().nullable(),
  bio: yup.string().nullable(),
  preferred_client: yup.string().nullable(),

  clients_situation: yup
    .array()
    .of(yup.string())
    .nullable(),
  other_clients_situation: yup.string().when("clients_situation", {
    is: (val: string[]) => val?.includes("other"),
    then: (schema) =>
      schema
        .required("Please specify other clients_situation")
        .min(2, "Must be at least 2 characters")
        .trim(),
    otherwise: (schema) => schema.notRequired(),
  }),

  // ---------------- STEP 4 ----------------
  coaching_boundaries: yup.string().nullable(),

  session_rates: yup
    .array().of(yup.string())
    .nullable(),
  collaboration_interest: yup
    .string().nullable(),
  terms_conditions: yup
    .boolean()
    .oneOf([true], "You must accept Terms & Conditions"),
});




const CoachRegister = () => {
  const [activeStep, setActiveStep] = useState(0);

  // RTK Query mutation hook
  const [createCoach, { isLoading: loadingCoachRegister }] = useCreateCoachMutation();
  const [getCoachById, { isLoading: loadingGetCoach }] = useGetCoachByIdMutation();
  const [updateCoach, { isLoading: loadingUpdateCoach }] = useUpdateCoachMutation();
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [completed, setCompleted] = useState(false);

  // type CredentialField = (typeof credentialFileMap)[Credential];

  // Toast message state for error notifications
  const [toast, setToast] = useState({ open: false, message: "", severity: "primary", autoHide: 6000 });
  // Success dialog state (replaces success toasts)
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAction, setSuccessAction] = useState<'login' | 'none'>('login');
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditRoute = location.pathname.startsWith("/coach/form/");


  // Fetch Terms & Conditions from Ghost using custom hook
  const { html: termsHtml, loading: termsLoading } = useGhostPostHTML(
    "limit=1&fields=html"
  );
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsDialogBody, setTermsDialogBody] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
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
      coaching_hours: undefined,
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
      preferred_client: "",

      coaching_style: [],
      other_coaching_style: "",
      other_clients_situation: "",
      connecting_coaches: 0,
      connecting_other_coaches: "",

      coaching_boundaries: "",
      session_rates: [],
      collaboration_interest: "",
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
  // useEffect(() => {
  //   setTimeout(()=>{
  //     setSuccessOpen(true)
  //   },3000)
  // }, []);

  useEffect(() => {
  }, [loadingCoachRegister]);

  // Watch for checkbox changes and open modal when checked manually
  const termsChecked = useWatch({
    control,
    name: "terms_conditions",
    defaultValue: false,
  });

  useEffect(() => {
    if (termsChecked) {
      setTermsOpen(true);
    }
  }, [termsChecked]);

  useEffect(() => {
    // populate dynamic dialog body when fetched
    setTermsDialogBody(termsHtml || "<p>No terms available.</p>");
  }, [termsHtml]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  // Fetch coach by id and populate form
  useEffect(() => {
    if (!id) return;

    const parseArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val === "" ? [] : val.split(",").map((s) => s.trim());
      return [];
    };

    const fetchAndPopulate = async () => {
      try {
        const res: any = await getCoachById({ coach_id: id }).unwrap();
        const coach = res?.data || res;
        if (!coach) return;

        // Basic fields
        setValue("first_name", coach.first_name ?? "");
        setValue("middle_name", coach.middle_name ?? "");
        setValue("last_name", coach.last_name ?? "");
        setValue("email", coach.email ?? "");
        setValue("mobile", coach.mobile ?? "");
        setValue("country_code", coach.country_code ?? "");
        setValue("timezone", coach.timezone ?? "");
        setValue("linked_url", coach.linked_url ?? "");
        setValue("website", coach.website ?? "");

        // Credentials and files (files typically come as URLs; keep file inputs undefined)
        setValue("coaching_credentials", parseArray(coach.coaching_credentials));
        setValue(
          "coaching_hours",
          coach.coaching_hours != null && coach.coaching_hours !== ""
            ? Number(coach.coaching_hours)
            : undefined
        );
        setValue("coaching_experience", coach.coaching_experience ?? "");
        setValue("industries", parseArray(coach.industries));
        setValue("leadership_levels", parseArray(coach.leadership_levels));

        // Text areas & arrays
        setValue("coaching_topics", coach.coaching_topics ?? "");
        setValue("coaching_philosophy", coach.coaching_philosophy ?? "");
        setValue("coaching_strength", coach.coaching_strength ?? "");
        setValue("preferred_client", coach.preferred_client ?? "");
        setValue("clients_situation", parseArray(coach.clients_situation));
        setValue("coaching_style", parseArray(coach.coaching_style));
        setValue("other_coaching_style", coach.other_coaching_style ?? "");
        setValue("other_clients_situation", coach.other_clients_situation ?? "");

        // Step 4
        setValue("coaching_boundaries", coach.coaching_boundaries ?? "");
        setValue("session_rates", parseArray(coach.session_rates));
        setValue("collaboration_interest", coach.collaboration_interest ?? "");
        // Ensure connecting_coaches stored as a number
        setValue("connecting_coaches", coach.connecting_coaches != null ? Number(coach.connecting_coaches) : 0);
        setValue("terms_conditions", !!coach.terms_conditions);

      } catch (error: any) {
        setToast({
          open: true,
          message: error?.data?.message || "Failed to fetch coach data",
          severity: "error",
          autoHide: 6000,
        });
      }
    };

    fetchAndPopulate();
  }, [id, getCoachById, setValue]);
  const ConnectingCoach = useWatch({
    control,
    name: "connecting_coaches",
  }) as number | undefined;
  // Numeric representation of the watched radio value
  const connectingCoachNumber = Number(ConnectingCoach ?? 0);

  useEffect(() => {
    if (!Array.isArray(selectedCredentials)) return;

    // If "None" selected → reset all
    if (selectedCredentials.includes("None")) {
      setValue("coaching_credentials", ["None"]);

      (Object.values(credentialFileMap) as readonly string[]).forEach(
        (field) => {
          setValue(field as any, null);
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



  // --------------------------- Save Coach ---------------------------

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (Array.isArray(value) && value.length && value[0] instanceof File) {
        console.log("Key:", key, "Value:", value);
        console.log("Appending multiple files for key:", key, value, typeof value);;
        value.forEach((file: File) => formData.append(key, file));

      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value ?? "");
      }
    });
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(key, value);
      }
    }
    console.log("terms_conditions type:", typeof data.terms_conditions, data.terms_conditions);
    console.log(" type_connecting_coaches:", typeof data.connecting_coaches, data.connecting_coaches);
    console.log(" type_connecting_experience:", typeof data.connecting_coaches, data.coaching_experience);
    try {
      if (id) {
        const response = await updateCoach({ id, data: formData }).unwrap();
        // open success dialog instead of toast
        setSuccessMessage(response?.message || "Coach updated successfully");
        setSuccessAction('login');
        setSuccessOpen(true);
      } else {
        const response = await createCoach(formData).unwrap();
        // open success dialog instead of toast
        setSuccessMessage(response?.message || "Coach created successfully");
        setSuccessAction('login');
        setSuccessOpen(true);
        console.log("Coach creation response:", response);
      }
    } catch (error: any) {
      setToast({
        open: true,
        message: error?.data?.message || "Something went wrong",
        severity: "error",
        autoHide: 5000,
      });
    }
  };
  // const handleNext = async () => {
  //   const fields = fieldsPerStep[activeStep];
  //   const isValid = await trigger(fields as any);

  //   if (!isValid) return;

  //   // ✅ SUBMIT ONLY ON LAST STEP
  //   if (activeStep === steps.length - 1) {
  //     await handleSubmit(onSubmit)();
  //     return;
  //   }

  //   setActiveStep((prev) => prev + 1);
  // };
  // const handleNext = async () => {
  //   if (activeStep === steps.length - 1) {
  //     await handleSubmit(onSubmit)();
  //     setCompleted(true); // ✅ SHOW 100%
  //     return;
  //   }
  //   setActiveStep((prev) => prev + 1);
  // };
  const handleNext = async () => {
    const fields = fieldsPerStep[activeStep];

    const isValid = await trigger(fields as any);

    // ❌ If invalid → stay on same step and SHOW errors
    if (!isValid) {
      return;
    }

    // ✅ Last step → submit
    if (activeStep === steps.length - 1) {
      await handleSubmit(onSubmit)();
      setCompleted(true);
      return;
    }

    // ✅ Move forward only if valid
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const countryOptions = countries.map((c) => ({
    value: `+${c.phone}`,          // stored in form → "IN"
    label: c.label,         // used for search → "India"
    code: `+${c.phone}`,
    iso: c.code,            // flag source → "IN"
  }));



  // const terms = [{ label: "Accept Terms and Conditions", value: true }];

  const terms = [{ label: "Accept Terms and Conditions", value: true }];

  const fieldsPerStep: string[][] = [
    ["first_name", "middle_name", "last_name", "email", "timezone", "linked_url"], // ✅ FIX
    ["coaching_credentials", "coaching_hours", "acc_upload_file", "pcc_upload_file", "mcc_upload_file", "emcc_upload_file", "co_active_upload_file", "other_upload_file", "other_coaching_credentials", "other_industries"],
    ["clients_situation", "coaching_topics", "coaching_philosophy", "coaching_strength", "preferred_client", "coaching_style", "other_coaching_style", "other_clients_situation", "industries", "leadership_levels",],
    ["coaching_boundaries", "collaboration_interest", "terms_conditions"], // ✅ FIX
  ];

  // Steps definition using useMemo for performance optimization
  // Each step contains UI content for the multi-step form
  const steps = [
    // ---------------------- STEP 1: Basic Information ----------------------
    {
      content: (
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
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 2 }}>
                          {/* <CountryCode control={control} errors={errors} /> */}
                          <CountryCode name="country_code"
                            label="Code" placeholder="+1" variant="labeled"
                            control={control} errors={errors} options={countryOptions}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 10 }}>
                          <InputNumber name="mobile" label="What is your phone number" placeholder="What is your phone number" control={control} errors={errors} variant="labeled"
                          />
                        </Grid>
                      </Grid>
                    </div>
                    <div className="formGroup">
                      <InputText name="linked_url" label="Please share your LinkedIn profile" placeholder="Please share your LinkedIn profile" variant="labeled" control={control} errors={errors} required
                      />
                    </div>
                    <div className="formGroup">
                      <InputText name="website" label="Please share your website or coach profile (if available), or another link that helps us understand your practice?" placeholder="Enter Website URL" variant="labeled" control={control} errors={errors} />
                    </div>
                    <div className="formGroup">
                      {/* <InputText name="timezone" label="Time Zone" placeholder="Enter Time Zone" variant="labeled" control={control} errors={errors} required /> */}
                      <Box className="formGroup">
                        <InputAutoComplete name="timezone" label="Which time zone are you in" placeholder="Which time zone are you in?" variant="labeled" required control={control} errors={errors} options={TIMEZONES} />
                      </Box>
                      {/* <Box className="formGroup">
                        <InputAutoComplete name="subscribtion" label="Subscribtion" placeholder="Select Timezone" variant="labeled" control={control} errors={errors} options={TIMEZONES} />
                      </Box> */}
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      ),
    },
    // ---------------------- STEP 2: Credentials & Experience ----------------------
    {
      content: (
        <Box className="py-5 px-3">
          <Container maxWidth="md">
            <Box className=" ">
              <Grid container spacing={4} className="formContent ">
                <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>
                  <Box className="formLeft">
                    <div className="formGroup">
                      <InputCheckbox name="coaching_credentials" label="Which coaching credentials do you hold?" control={control} errors={errors} multiple required showOtherField
                        options={coachingCredentials} />
                    </div>
                    <Typography variant="body1" component="p" className="FormTitleforchechbox">
                      Please upload proof of your coaching credential
                    </Typography>
                    {(Object.entries(credentialFileMap) as [keyof typeof credentialFileMap, string][])
                      .filter(([credential]) => Array.isArray(selectedCredentials) && selectedCredentials.includes(credential as any))
                      .map(([credential, field]) => {
                        const displayCredential = credential === "other" ? "Other" : String(credential);
                        return (
                          <div key={`${field}-upload`} className={styles.uploadLeftAlign}>
                            <FileUploadInput
                              key={field}
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
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      )
    },
    // ---------------------- STEP 3: Focus & Style ----------------------
    {
      content: (
        <Box className="py-5 px-3">
          <Container maxWidth="md">
            <Box>
              <Grid container spacing={4} className="formContent">
                <Grid size={{ xs: 12, md: 12 }} order={{ xs: 2, md: 1 }}>
                  <Box className="formRight mt-5">
                    <div className="formGroup">
                      <InputCheckbox name="industries" label="Which industries do you have professional or coaching experience in?" control={control} errors={errors} multiple required showOtherField
                        options={industriesList}
                      />
                    </div>
                    <div className="formGroup" style={{ marginTop: "24px" }}>
                      <InputCheckbox name="leadership_levels" label="Which leadership levels do you coach?" control={control} errors={errors} multiple required
                        options={leadershipLevels}
                      />
                    </div>
                  </Box>
                  <Box className="formLeft">
                    <div className="formGroup">
                      <InputTextArea name="coaching_topics" label="What coaching topics do you feel most experienced or effective in supporting?" placeholder="Type Here..." control={control} errors={errors} variant="labeled" />
                    </div>
                    <div className="formGroup">
                      <InputCheckbox name="coaching_style" label="Which coaching styles or approaches do you use?" control={control} errors={errors} multiple required showOtherField
                        options={coachingStyle}
                      />

                      {/* <InputCheckbox
                        name="coaching_style"
                        label="Coaching Style Spectrum"
                        control={control}
                        errors={errors}
                        multiple
                        required
                        options={[
                          { value: "direct_reflective", label: "Direct Reflective" },
                          { value: "structured_exploratory", label: "Structured Exploratory" },
                          { value: "tactical_strategic", label: "Tactical Strategic" },
                          { value: "action_insight", label: "Action Insight" },
                        ]}
                      /> */}
                    </div>

                  </Box>

                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      )
    },
    // ---------------------- STEP 4: Coaching Boundaries ----------------------
    {
      content: (
        <Box className="py-5 px-5">
          <Container maxWidth="md">
            <Box>
              <Grid container spacing={4} className="formContent">
                <Grid size={{ xs: 12, }} order={{ xs: 2, md: 1 }}>
                  <Box className="formLeft">
                    <div className="formGroup">
                      <div className="formGroup">
                        <InputText name="coaching_philosophy" label="In one sentence, what is your coaching philosophy?" placeholder="Type Here..." control={control} errors={errors} variant="labeled" />
                      </div>
                      <Box className="formRight">
                        <div className="formGroup">
                          <InputText name="coaching_strength" label="What are your top three coaching strengths?" placeholder="Type Here..." control={control} errors={errors} variant="labeled" />
                        </div>
                        <div className="formGroup">
                          <InputText name="preferred_client" label="Who is your ideal client to coach?" placeholder="Type Here..." control={control} errors={errors} variant="labeled"
                          />
                        </div>
                        <div className="formGroup">
                          <InputCheckbox name="clients_situation" label="Which client types or situations do you NOT coach?" control={control} errors={errors} multiple showOtherField
                            options={clientSituations}
                          />
                        </div>
                      </Box>
                      <InputTextArea
                        name="coaching_boundaries" label="Are there any boundaries or limitations in your coaching practice you'd like to note?" placeholder="Type Here..." variant="labeled" control={control} errors={errors} />
                    </div>
                    <div className="formGroup" style={{ marginTop: "24px" }}>
                      {isEditRoute && <InputCheckbox name="session_rates" label="What session rates do you accept?" control={control} errors={errors} multiple required
                        options={sessionRates} />}
                    </div>
                    <Box className="formRight">
                      <div className="formGroup">
                        <InputTextArea name="collaboration_interest" label="Is there anything else you’d like to share?" placeholder="Type Here..." variant="labeled" control={control} errors={errors} />
                      </div>
                    </Box>
                    <div className="formGroup mt-5">
                      {isEditRoute && (
                        <InputRadio name="connecting_coaches" label="Interest in Connecting/Collaborating with Other Coaches" control={control}
                          options={DEFAULT_RADIO_OPTIONS}
                        />
                      )}
                      {isEditRoute && connectingCoachNumber === 1 && (
                        <InputText name="connecting_other_coaches" placeholder="Type Here..." variant="labeled" control={control}
                        />
                      )}
                    </div>
                    <Box className="formRight">
                      {isEditRoute && <div className="formGroup">
                        <InputTextArea name="bio" label="Bio" placeholder="Type Here..." variant="labeled" control={control} />
                      </div>}

                    </Box>
                    <Box className="formRight">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InputCheckbox name="terms_conditions" control={control} errors={errors} options={terms} required />
                        <Link component="button" variant="body2" onClick={() => setTermsOpen(true)}>
                        </Link>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                {/* <Grid size={{ xs: 12, md: 2 }} order={{ xs: 3, md: 2 }}>
                  <div className={styles.dividerWrapper}>
                    <div className={styles.divider}></div>
                  </div>
                </Grid> */}
                <Grid size={{ xs: 12, md: 5 }} order={{ xs: 1, md: 3 }}>

                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      )
    }
  ];

  return (
    <Box className="p-4  text-start" >
      <Box className={styles.container}>
        {/* <Box className={styles.text}>
          <Typography variant="h4" color="white" className={styles.title}>
            Coach Management
          </Typography>
          <Typography color="white">View and Manage Coaches</Typography>
        </Box> */}
        <Box className=" row align-items-center">

          <Box className="col-2">
            <img src={logo} alt="Logo" className={styles.logo} />
          </Box>

          <Box className="col-8 text-center">
            <Typography variant="h4" color="black">
              Coach Registration Form
            </Typography>
          </Box>

          <Box className="col-2" />
        </Box>


      </Box>

      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {(loadingCoachRegister || loadingGetCoach || loadingUpdateCoach) && (
          <div
            className={`${styles.globalLoaderOverlay} d-flex align-items-center justify-content-center`}
          >
            <Loader />
          </div>
        )}

        <Box className={styles.coachFormBackground}>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            component="div"
            completed={completed}
          />
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
              if (successAction === "login") {
                navigate("/auth/login", { replace: true });
              }
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
              setTermsAgreed(true);
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

export default CoachRegister;



