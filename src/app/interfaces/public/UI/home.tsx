// Import Packages 
import { useState } from "react";
import { Box, Card, Container, Grid, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Import Files
import "../../../../App.css";
import styles from '../../../../shared/components/card/Card.module.scss'
import formField from "../../../../shared/components/formFields/FormFields.module.scss"
import Button from "../../../../shared/components/button/Button";
import { Table } from "../../../../shared/components/table/Table";
import Pagination from "../../../../shared/components/pagination/Pagination";
import Loader from "../../../../shared/components/loader/Loader";
import Dialog from "../../../../shared/components/dialog/Dialog";
import ToastMessage from "../../../../shared/components/toastMessage/ToastMessage";
import UserAvatar from "../../../../shared/components/avatar/Avatar";
import Tabs from "../../../../shared/components/tabs/Tabs";
import Accordion from "../../../../shared/components/accordion/Accordion";
import ThemeSwitcher from "../../../../shared/components/themeSwitcher/ThemeSwitcher";
import Stepper from "../../../../shared/components/stepper/Stepper";
import InputText from "../../../../shared/components/formFields/InputText";
import InputNumber from "../../../../shared/components/formFields/InputNumber";
import InputTextArea from "../../../../shared/components/formFields/InputTextArea";
import InputSelect from "../../../../shared/components/formFields/InputSelect";
import InputCheckbox from "../../../../shared/components/formFields/InputCheckbox";
import InputRadio from "../../../../shared/components/formFields/InputRadio";
import InputRange from "../../../../shared/components/formFields/InputRange";
import InputDatePicker from "../../../../shared/components/formFields/InputDatePicker";
import InputTimePicker from "../../../../shared/components/formFields/InputTimePicker";
import InputColorPicker from "../../../../shared/components/formFields/InputColorPicker";
import InputAutoComplete from "../../../../shared/components/formFields/InputAutoComplete";
import InputFileUpload from "../../../../shared/components/formFields/InputFileUpload";
import UniversalCard from "../../../../shared/components/card/Card";

const schema = yup.object().shape({
  name: yup.string().default('').required('Name required'),
  age: yup.number().required('Age required'),
  bio: yup.string().default('').required('Bio is required'),
  hobbies: yup.array().default([]).min(1, 'Hobbies is required').required(),
  agree: yup.boolean().default(false).oneOf([true], 'You must accept Terms & Conditions'),
  course: yup.string().default('').required('Course Required'),
  primaryLanguage: yup.string().default('').required('Primary language Required'),
  skills: yup.array().default([]).min(1, 'Skills is required'),
  languages: yup.array().default([]).min(1, 'Language is required'),
  gender: yup.string().default('').required('Gender is required'),
  dob: yup.date().required('Date is required'),
  time: yup.date().required('Time is required'),
  rating: yup.string().default(''),
  color: yup.string().default(''),
  profilePic: yup
    .mixed<File>()
    .required("Image is required")
    .test("fileType", "Only PNG and JPG allowed", (value) => {
      const file = value as File | null;
      if (!file) return false;
      return ["image/png", "image/jpeg"].includes(file.type);
    })
    .test("fileSize", "Max size 2MB", (value) => {
      const file = value as File | null;
      if (!file) return false;
      return file.size <= 2 * 1024 * 1024;
    }),
  documents: yup.mixed<File[]>()
    .test("required", "At least one file required", (value) => {
      const files = value as File[] | null;
      if (!files || files.length === 0) return false;
      return true;
    })

    .test("fileType", "Only PDF, DOC, DOCX allowed", (value) => {
      const files = value as File[] | null;
      if (!files || files.length === 0) return false;

      const allowedExtensions = [".pdf", ".doc", ".docx"];

      return files.every((f) =>
        allowedExtensions.includes(f.name.toLowerCase().slice(-4))
      );
    })

    .test("fileSize", "Each file must be below 2MB", (value) => {
      const files = value as File[] | null;
      if (!files) return false;
      return files.every((f) => f.size <= 2 * 1024 * 1024);
    })
});

export function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "warning" | "info",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [activeStep, setActiveStep] = useState(0);

  const [rows] = useState([
    { id: 1, name: "Ashok", email: "ashok@email.com", role: "Admin", active: true },
    { id: 2, name: "Priya", email: "priya@email.com", role: "User", active: false },
  ]);

  const columns = ["Name", "Email Address", "Role"];

  const keys = ["name", "email_address", "role"]

  const editStaff = (row: any) => alert(`Editing ${row.name}`);
  const deleteStaff = (row: any) => alert(`Deleting ${row.name}`);
  const viewStaff = (row: any) => alert(`Viewing ${row.name}`);
  const handleToggle = (row: any) =>
    alert(`${row.name} is now ${row.active ? "Inactive" : "Active"}`);

  const actions = [
    {
      icon: <VisibilityIcon fontSize="small" />,
      tooltip: "View Details",
      color: "warning",
      onClick: viewStaff,
    },
    {
      icon: <EditIcon fontSize="small" />,
      tooltip: "Edit",
      color: "primary",
      onClick: editStaff,
    },
    {
      icon: <DeleteIcon fontSize="small" />,
      tooltip: "Delete",
      color: "error",
      onClick: deleteStaff,
    },
    {
      icon: rows[0].active ? (
        <ToggleOnIcon fontSize="small" />
      ) : (
        <ToggleOffIcon fontSize="small" />
      ),
      tooltip: "Toggle Active",
      color: "customSecond",
      onClick: handleToggle,
    },
  ];

  const showToast = (message: string, severity: "success" | "error" | "warning" | "info") => {
    setToast({ open: true, message, severity });
  };

  const handleClose = () => {
    setToast({ ...toast, open: false });
  }

  const steps = [
    { label: "Step 1", content: <div>Step 1 content</div> },
    { label: "Step 2", content: <div>Step 2 content</div> },
    { label: "Step 3", content: <div>Step 3 content</div> },
    { label: "Step 4", content: <div>Step 3 content</div> },
  ];

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const gender = ["Male", "Female"];

  const courses = [
    { value: "react", label: "React" },
    { value: "angular", label: "Angular" },
  ];

  const skills = [
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "js", label: "JS" },
  ];

  const hobbies = [
    { label: "Reading", value: "Reading" },
    { label: "Singing", value: "Singing" },
    { label: "Dancing", value: "Dancing" },
    { label: "Gaming", value: "Gaming" },
  ];

  const language = [
    { label: "Tamil", value: "Tamil" },
    { label: "English", value: "English" },
    { label: "Hindi", value: "Hindi" },
    { label: "Malayalam", value: "Malayalam" },
  ];

  const terms = [{ label: "Accept Terms and Conditions", value: true }];

  const handleForm = (data: any) => console.table(data);

  return (
    <div className="demo-page bg-light py-4">
      <Container maxWidth="xl">
        <h2 className="mb-4 text-center fw-bold">Component Showcase</h2>
        <Grid spacing={4} {...({} as any)}>

          {/* Button Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start d-flex justify-content-between">
              {/* Default MUI colors and dynamic colors*/}
              <Button label="Primary" color="primary" />
              <Button label="Secondary" color="secondary" variant="outlined" />
              <Button label="Error" color="customSecond" variant="text" />

              {/* Dynamic Sizes */}
              <Button label="Primary" color="primary" size="small" />
              <Button label="Secondary" color="customFirst" size="medium" />
              <Button label="Error" color="customSecond" size="large" />
            </Paper>
          </Grid>

          {/* Table Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Table Component (Dynamic Actions)</h4>
              <Table columns={columns} rows={rows} actions={actions} keys={keys} multiple={true} />
            </Paper>
          </Grid>

          {/* Pagination Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Pagination Component</h4>
              <Pagination
                page={page}
                itemsPerPage={itemsPerPage}
                totalItems={30}
                onPageChange={(p, size: any) => {
                  setPage(p);
                  setItemsPerPage(size);
                }}
              />
            </Paper>
          </Grid>

          {/* Loader Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Loader Component</h4>
              <Loader size={50} color="primary" />
            </Paper>
          </Grid>

          {/* Dialog Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Dialog Component</h4>
              <Button label="Open Dialog" variant="contained" onClick={() => setOpenDialog(true)} />
              <Dialog
                open={openDialog}
                title="Delete User"
                content="Are you sure you want to delete this user?"
                buttons={[
                  { label: "Cancel", onClick: () => setOpenDialog(false) },
                  { label: "Delete", onClick: () => alert("Deleted"), color: "error" },
                ]}
              />
            </Paper>
          </Grid>

          {/* Toast Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Toast Message Component</h4>
              <Button className="me-3" label="Show Error Toast" variant="outlined" color="error" onClick={() => showToast("Operation Failed!", "error")} />
              <Button className="me-3" label="Show Warning Toast" variant="text" color="warning" onClick={() => showToast("Warning!", "warning")} />
              <Button label="Show Success Toast" color="success" onClick={() => showToast("Operation successful!", "success")} />
              <ToastMessage
                open={toast.open}
                message={toast.message}
                severity={toast.severity}
                onClose={handleClose}
              />
            </Paper>
          </Grid>

          {/* User Avatar Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">User Avatar Component</h4>
              <UserAvatar name="Ashok Alagiah" />
            </Paper>
          </Grid>

          {/* Tabs Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Tabs Component</h4>
              <Tabs
                tabs={[
                  { label: "Profile", content: <div>Profile Content</div> },
                  { label: "Settings", content: <div>Settings Content</div> },
                ]}
              />
            </Paper>
          </Grid>

          {/* Accordion Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Accordion Component</h4>
              <Accordion
                items={[
                  { title: "Question 1", content: "Answer 1" },
                  { title: "Question 2", content: "Answer 2" },
                ]}
              />
            </Paper>
          </Grid>

          {/* Theme Switcher Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Theme Switcher Component</h4>
              <ThemeSwitcher
                isDarkMode={darkMode}
                onToggle={() => setDarkMode(!darkMode)}
              />
            </Paper>
          </Grid>

          {/* Card Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Stepper Component</h4>
              <UniversalCard variant="profile">
                <img src="/images/jane.png" className={styles.avatar} />

                <div>
                  <p><b>Full Name:</b> Jane Cooper</p>
                  <p><b>Email Address:</b> janecoop@gmail.com</p>
                  <p><b>Phone Number:</b> (555) 201-4821</p>
                  <p><b>Reason:</b> I feel I need a coach...</p>
                </div>
              </UniversalCard>
              {/* <UniversalCard variant="suggested">
                <div className={styles.header}>Suggested Coaches</div>

                {suggestedList.map((coach) => (
                  <div className={styles.row}>
                    <img src={coach.img} />
                    <div>
                      <p>{coach.name}</p>
                      <p>{coach.email}</p>
                    </div>
                    <div className={styles.tags}>
                      <span>Fitness</span>
                      <span>Mindset</span>
                    </div>
                    <span className={styles.rating}>⭐ {coach.rating}</span>
                    <button className={styles.assign}>Assign</button>
                  </div>
                ))}
              </UniversalCard>
              <UniversalCard variant="coach">
                <div className={styles.topRow}>
                  <span className={styles.selected}>Selected</span>
                  <button className={styles.menuBtn}>⋮</button>
                </div>

                <div className={styles.coachInfo}>
                  <img src={coach.img} />
                  <div>
                    <div className={styles.name}>{coach.name}</div>
                    <div className={styles.email}>{coach.email}</div>
                  </div>
                  <span className={styles.rating}>⭐ {coach.rating}</span>
                </div>

                <div className={styles.tags}>
                  <span>Fitness</span>
                  <span>Mindset</span>
                </div>
              </UniversalCard> */}


            </Paper>
          </Grid>

          {/* Stepper Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} className="p-4 mb-3 text-start">
              <h4 className="mb-3">Stepper Component</h4>
              <Stepper
                steps={steps}
                activeStep={activeStep}
                onNext={() => setActiveStep((prev) => prev + 1)}
                onBack={() => setActiveStep((prev) => prev - 1)}
                onReset={() => setActiveStep(0)}
              />
            </Paper>
          </Grid>

          {/* Form Section */}
          <Grid size={12} {...({} as any)}>
            <Paper elevation={3} component={'form'} className={formField.layout} onSubmit={handleSubmit(handleForm)}>
              <h4 className="mb-3">Form Component</h4>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <InputText size="normal" name="name" label="Name" placeholder="Enter name" variant="labeled" control={control} errors={errors} onChange={(e) => console.info("Value typed:", e)} required />
                </Grid>
                <Grid size={6}>
                  <InputNumber name="age" label="Age" placeholder="Enter age" variant="labeled" control={control} errors={errors} onChange={(e) => { console.info("Input Number:", e); }} required />
                </Grid>
                <Grid size={6}>
                  <InputCheckbox name="hobbies" label="Hobbies" required control={control} errors={errors} options={hobbies} multiple onChange={(e) => console.info("Input checkbox:", e)} showOtherField />
                </Grid>
                <Grid size={6}>
                  <InputRadio name="gender" label="Gender" required control={control} errors={errors} options={gender} />
                </Grid>
                <Grid size={6}>
                  <InputSelect name="course" label="Course" placeholder="Select course" required variant="labeled" control={control} errors={errors} options={courses} showOtherField />
                </Grid>
                <Grid size={6}>
                  <InputSelect name="skills" label="Skills" placeholder="Select skills" required variant="labeled" control={control} errors={errors} options={skills} multiple />
                </Grid>
                <Grid size={6}>
                  <InputDatePicker name="dob" label="Date of Birth" placeholder="Select Date" variant="labeled" required control={control} errors={errors} />
                </Grid>
                <Grid size={6}>
                  <InputTimePicker name="time" label="Time" placeholder="Select Date" variant='labeled' required control={control} errors={errors} />
                </Grid>
                <Grid size={6}>
                  <InputRange name="rating" label="Skill Rating" control={control} />
                </Grid>
                <Grid size={6}>
                  <InputColorPicker name="color" label="Choose Favorite Color" variant="labeled" required control={control} />
                </Grid>
                <Grid size={6}>
                  <InputAutoComplete name="primaryLanguage" label="Primary Language" placeholder="Choose primary language" variant="labeled" required control={control} errors={errors} options={language} showOtherField />
                </Grid>
                <Grid size={6}>
                  <InputAutoComplete name="languages" label="Language" variant="labeled" placeholder="Choose language" required control={control} errors={errors} options={language} multiple showOtherField />
                </Grid>
                <Grid size={6}>
                  <InputFileUpload name="profilePic" label="Upload Profile Picture" control={control} errors={errors} infoTooltip="File Size - Max (2GB)" accept="image/*" showImagePreview required />
                </Grid>
                <Grid size={6}>
                  <InputFileUpload name="documents" label="Upload Documents" control={control} errors={errors} multiple infoTooltip="File Size - Max (2GB)" accept=".pdf,.doc,.docx" required />
                </Grid>
                <Grid size={12}>
                  <InputTextArea name="bio" label="Bio" placeholder="Enter text" variant="labeled" required control={control} errors={errors} />
                </Grid>
                <Grid size={12}>
                  <InputCheckbox name="agree" control={control} errors={errors} options={terms} />
                </Grid>
                <Grid size={12} textAlign={'end'}>
                  <Button label="Submit" type="submit" variant="contained" />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}