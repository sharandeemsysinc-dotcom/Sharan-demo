// // Import Packages
// import {
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     Typography,
//     Paper,
//     IconButton,
//     FormHelperText,
//     FormControl,
//     Box,
//     Tooltip
// } from "@mui/material";
// import { Controller } from "react-hook-form";
// import { useEffect, useState } from "react";

// import DescriptionIcon from "@mui/icons-material/Description";
// import CloseIcon from "@mui/icons-material/Close";
// import InfoIcon from "@mui/icons-material/InfoOutlined";

// // Import Files
// import fileUpload from './FormFields.module.scss';
// import Button from '../button/Button';

// interface Props {
//     name: string;
//     label: any;
//     control: any;
//     errors?: any;
//     infoTooltip?: any;
//     multiple?: boolean;
//     required?: boolean;
//     disabled?: boolean;
//     accept?: string;
//     showImagePreview?: boolean;
//     defaultImage?: string;
// }

// export default function FileUploadInput({
//     name,
//     label,
//     control,
//     errors,
//     infoTooltip,
//     multiple = false,
//     required = false,
//     disabled = false,
//     accept = "*",
//     showImagePreview = false,
//     defaultImage = ""
// }: Props) {

//     const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//     const [previewFile, setPreviewFile] = useState<string | null>(null);
//     const [previewOpen, setPreviewOpen] = useState(false);

//     const [backendImage, setBackendImage] = useState<string>("");

//     // When component receives backend/default image
//     useEffect(() => {
//         if (defaultImage) {
//             setBackendImage(defaultImage);
//         }
//     }, [defaultImage]);

//     const removeFile = () => {
//         setSelectedFiles([]);
//         setBackendImage(""); // remove backend image
//     };

//     const openPreview = (file: File | string) => {
//         const url = typeof file === "string" ? file : URL.createObjectURL(file);
//         setPreviewFile(url);
//         setPreviewOpen(true);
//     };

//     const singleFile =
//         !multiple && selectedFiles.length === 1 ? selectedFiles[0] : null;

//     const isImagePreview =
//         showImagePreview && (singleFile || backendImage);

//     return (
//         <>
//             <FormControl fullWidth error={!!errors?.[name]}>
//                 <Controller
//                     name={name}
//                     control={control}
//                     render={({ field }) => (
//                         <div>

//                             {/* Profile Image: Backend Image OR New Upload */}
//                             {(isImagePreview && !multiple) && (
//                                 <div className={`${fileUpload.circularProfile} ${fileUpload.filePosition}`}>

//                                     <img
//                                         src={
//                                             singleFile
//                                                 ? URL.createObjectURL(singleFile)
//                                                 : backendImage
//                                         }
//                                         className={fileUpload.circularProfileImg}
//                                         onClick={() =>
//                                             singleFile
//                                                 ? openPreview(singleFile)
//                                                 : openPreview(backendImage)
//                                         }
//                                     />

//                                     {/* Remove */}
//                                     {!defaultImage && (

//                                         <IconButton
//                                             size="small"
//                                             className={fileUpload.removeIcon}
//                                             onClick={() => {
//                                                 removeFile();
//                                                 field.onChange(null);
//                                             }}
//                                         >
//                                             <CloseIcon fontSize="small" />
//                                         </IconButton>
//                                     )

//                                     }
//                                 </div>
//                             )}

//                             {/* Hidden INPUT */}
//                             <input
//                                 type="file"
//                                 id={name}
//                                 className={fileUpload.hiddenInput}
//                                 multiple={multiple}
//                                 disabled={disabled}
//                                 accept={accept}
//                                 onChange={(e) => {
//                                     const files = e.target.files
//                                         ? Array.from(e.target.files)
//                                         : [];

//                                     setSelectedFiles(files);
//                                     setBackendImage(""); // remove backend image once new image uploaded

//                                     // For single file: pass the first file or null
//                                     // For multiple files: pass the array
//                                     if (multiple) {
//                                         field.onChange(files);
//                                     } else {
//                                         field.onChange(files.length > 0 ? [files[0]] : null);
//                                     }
//                                 }}
//                             // onChange={(e) => {
//                             //     const files = e.target.files
//                             //         ? Array.from(e.target.files)
//                             //         : [];

//                             //     setSelectedFiles(files);
//                             //     setBackendImage(""); // remove backend image once new image uploaded

//                             //     field.onChange(
//                             //         multiple ? files : files || null
//                             //     );
//                             // }}

//                             // onChange={(e) => {
//                             //     const files = e.target.files ? Array.from(e.target.files) : [];

//                             //     setSelectedFiles(files);
//                             //     setBackendImage("");

//                             //     // SEND ARRAY ALWAYS
//                             //     field.onChange(files);
//                             // }}

//                             />

//                             {/* Upload Button */}
//                             <Box className="d-flex justify-content-center mt-3">
//                                 <label htmlFor={name}>
//                                     <Button
//                                         label={
//                                             required && label ? (
//                                                 <span>
//                                                     <span className={fileUpload.required}>*</span> {label}
//                                                 </span>
//                                             ) : (
//                                                 label
//                                             )
//                                         }
//                                         variant="contained"
//                                         component="span"
//                                         fullWidth
//                                     />
//                                 </label>
//                                 <Tooltip title={infoTooltip} placement="bottom" arrow>
//                                     <IconButton >
//                                         <InfoIcon fontSize="small" />
//                                     </IconButton>
//                                 </Tooltip>
//                             </Box>


//                             {errors?.[name] && (
//                                 <FormHelperText className={fileUpload.error}>
//                                     {errors?.[name]?.message}
//                                 </FormHelperText>
//                             )}

//                             {/* Multiple File Preview */}
//                             {selectedFiles.length > 0 && multiple && (
//                                 <>
//                                     <Typography variant="body2">
//                                         Selected File(s):
//                                     </Typography>

//                                     <div className={`${fileUpload.file} ${fileUpload.filePosition}`}>
//                                         {selectedFiles.map((file, index) => (
//                                             <div key={index} className={fileUpload.fileDelete}>
//                                                 <IconButton
//                                                     size="small"
//                                                     onClick={() => removeFile()}
//                                                     className={fileUpload.removeIcon}
//                                                 >
//                                                     <CloseIcon fontSize="small" />
//                                                 </IconButton>

//                                                 <Paper
//                                                     elevation={2}
//                                                     onClick={() => openPreview(file)}
//                                                     className={fileUpload.documentPreview}
//                                                 >
//                                                     <DescriptionIcon color="primary" />
//                                                     <Typography variant="body2" className={fileUpload.fileName}>
//                                                         {file.name}
//                                                     </Typography>
//                                                 </Paper>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     )}
//                 />

//                 {/* Preview Popup */}
//                 <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
//                     <DialogTitle>Preview</DialogTitle>
//                     <DialogContent>
//                         {previewFile &&
//                             (previewFile.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
//                                 <img
//                                     src={previewFile}
//                                     className={fileUpload.imgPreviewPopUp}
//                                 />
//                             ) : (
//                                 <iframe
//                                     src={previewFile}
//                                     className={fileUpload.filePreviewPopUp}
//                                 />
//                             ))}
//                     </DialogContent>
//                 </Dialog>
//             </FormControl>
//         </>
//     );
// }
// Import Packages
import { Dialog, DialogContent, DialogTitle, Typography, Paper, IconButton, FormHelperText, FormControl, Box, Tooltip, Button as MuiButton, Grid, Chip, } from "@mui/material";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
 
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
 
// Import Files
import fileUpload from './FormFields.module.scss';
import Button from '../button/Button';
 
interface Props {
    name: string;
    label: any;
    control: any;
    errors?: any;
    infoTooltip?: any;
    multiple?: boolean;
    required?: boolean;
    disabled?: boolean;
    accept?: string;
    showImagePreview?: boolean;
    defaultImage?: string;
    defaultValue?: any;
    key: any;
}
 
export default function FileUploadInput({
    name,
    label,
    control,
    errors,
    infoTooltip,
    multiple = false,
    required = false,
    disabled = false,
    accept = "*",
    showImagePreview = false,
    defaultImage = "",
    defaultValue = "",
    key
}: Props & { key?: string }) {

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState<string>("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [backendImage, setBackendImage] = useState<string>("");
    const [currentPreviewFile, setCurrentPreviewFile] = useState<any>(null);

    // Initialize with existing files from backend
    useEffect(() => {
        if (defaultValue) {
            if (multiple && Array.isArray(defaultValue)) {
                setExistingFiles(defaultValue);
            } else if (!multiple && defaultValue) {
                if (typeof defaultValue === 'string') {
                    setBackendImage(defaultValue);
                } else if (Array.isArray(defaultValue)) {
                    setExistingFiles(defaultValue);
                } else {
                    setExistingFiles([defaultValue]);
                }
            }
        } else if (defaultImage) {
            setBackendImage(defaultImage);
        }
    }, [defaultValue, defaultImage]);

    // Check if a file is an image
    const isImageFile = (fileName: string): boolean => {
        return /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(fileName);
    };

    // Check if a URL is an image
    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(url) ||
            /^data:image\//i.test(url);
    };

    // Get file icon based on file type
    const getFileIcon = (fileName: string, size: 'small' | 'medium' | 'large' = 'medium') => {
        const iconSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';

        if (isImageFile(fileName)) {
            return <ImageIcon fontSize={iconSize} color="primary" />;
        } else if (fileName.match(/\.(pdf)$/i)) {
            return <PictureAsPdfIcon fontSize={iconSize} color="error" />;
        } else {
            return <InsertDriveFileIcon fontSize={iconSize} color="action" />;
        }
    };

    // Get file color based on type
    const getFileColor = (fileName: string): string => {
        if (isImageFile(fileName)) {
            return '#1976d2'; // Blue for images
        } else if (fileName.match(/\.(pdf)$/i)) {
            return '#d32f2f'; // Red for PDFs
        } else if (fileName.match(/\.(doc|docx)$/i)) {
            return '#1976d2'; // Blue for Word docs
        } else if (fileName.match(/\.(xls|xlsx)$/i)) {
            return '#388e3c'; // Green for Excel
        } else {
            return '#757575'; // Grey for others
        }
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file URL for preview
    const getFileUrl = (file: any): string => {
        if (file instanceof File) {
            return URL.createObjectURL(file);
        } else if (file?.url) {
            return file.url;
        } else if (typeof file === 'string') {
            return file;
        } else if (file?.fileUrl) {
            return file.fileUrl;
        }
        return '';
    };

    // Get file name
    const getFileName = (file: any): string => {
        if (file instanceof File) {
            return file.name;
        } else if (file?.fileName) {
            return file.fileName;
        } else if (file?.name) {
            return file.name;
        } else if (typeof file === 'string') {
            return file.split('/').pop() || 'File';
        }
        return 'Unknown File';
    };

    // Get file size
    const getFileSize = (file: any): string => {
        if (file instanceof File) {
            return formatFileSize(file.size);
        } else if (file?.size) {
            return formatFileSize(file.size);
        }
        return '';
    };

    // Remove single file
    const removeSingleFile = (index: number, isExistingFile: boolean = false, field: any) => {
        if (isExistingFile) {
            const newExistingFiles = [...existingFiles];
            newExistingFiles.splice(index, 1);
            setExistingFiles(newExistingFiles);
            field.onChange(newExistingFiles);
        } else {
            const newSelectedFiles = [...selectedFiles];
            newSelectedFiles.splice(index, 1);
            setSelectedFiles(newSelectedFiles);

            if (multiple) {
                field.onChange(newSelectedFiles);
            } else {
                field.onChange("");
            }
        }
    };

    // Remove all files
    const removeAllFiles = (field: any) => {
        setSelectedFiles([]);
        setExistingFiles([]);
        setBackendImage("");
        field.onChange(multiple ? [] : "");
    };

    const openPreview = (file: any) => {
        const url = getFileUrl(file);
        const fileName = getFileName(file);

        setPreviewFile(url);
        setPreviewFileName(fileName);
        setCurrentPreviewFile(file);
        setPreviewOpen(true);
    };

    // Handle download
    const handleDownload = () => {
        if (!currentPreviewFile) return;

        const fileUrl = getFileUrl(currentPreviewFile);
        const fileName = getFileName(currentPreviewFile);

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (previewFile && previewFile.startsWith('blob:')) {
                URL.revokeObjectURL(previewFile);
            }
        };
    }, [previewFile]);

    // Check if we should show circular image preview
    const shouldShowCircularImage = (): boolean => {
        if (!showImagePreview) return false;
        if (multiple) return false;

        if (selectedFiles.length === 1) {
            return isImageFile(selectedFiles[0].name);
        }

        if (backendImage && isImageUrl(backendImage)) {
            return true;
        }

        return false;
    };

    // Check if file can be previewed in browser
    const canPreviewInBrowser = (fileName: string): boolean => {
        if (!fileName) return false;
        const isImage = /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(fileName);
        const isPDF = /\.(pdf)$/i.test(fileName);
        return isImage || isPDF;
    };

    return (
        <>
            <FormControl fullWidth error={!!errors?.[name]}>
                <Controller
                    name={name}
                    control={control}
                    defaultValue={multiple ? [] : ""}
                    render={({ field }) => (
                        <div>
                            {/* Circular Image Preview - ONLY for single image files */}
                            {shouldShowCircularImage() && (
                                <div className={`${fileUpload.circularProfile} ${fileUpload.filePosition}`}>
                                    <img
                                        src={
                                            selectedFiles.length === 1
                                                ? URL.createObjectURL(selectedFiles[0])
                                                : backendImage
                                        }
                                        className={fileUpload.circularProfileImg}
                                        onClick={() =>
                                            selectedFiles.length === 1
                                                ? openPreview(selectedFiles[0])
                                                : openPreview(backendImage)
                                        }
                                        alt="Profile"
                                    />
                                    {!defaultImage && (
                                        <IconButton
                                            size="small"
                                            className={fileUpload.removeIcon}
                                            onClick={() => removeAllFiles(field)}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </div>
                            )}

                            {/* Hidden INPUT */}
                            <input
                                type="file"
                                id={name}
                                className={fileUpload.hiddenInput}
                                multiple={multiple}
                                disabled={disabled}
                                accept={accept}
                                onChange={(e) => {
                                    const files = e.target.files
                                        ? Array.from(e.target.files)
                                        : [];

                                    if (multiple) {
                                        const allFiles = [...selectedFiles, ...files];
                                        setSelectedFiles(allFiles);
                                        field.onChange(allFiles);
                                    } else {
                                        if (files.length > 0) {
                                            setSelectedFiles(files);
                                            setBackendImage("");
                                            field.onChange([files[0]]);
                                        } else {
                                            setSelectedFiles([]);
                                            field.onChange("");
                                        }
                                    }
                                }}
                            />

                            {/* Upload Button */}
                            <Box className="d-flex justify-content-center mt-3">
                                <label htmlFor={name}>
                                    <Button
                                        label={
                                            required && label ? (
                                                <span>
                                                    <span className={fileUpload.required}>*</span> {label}
                                                </span>
                                            ) : (
                                                label
                                            )
                                        }
                                        variant="contained"
                                        component="span"
                                        fullWidth
                                    />
                                </label>
                                {infoTooltip && (
                                    <Tooltip title={infoTooltip} placement="bottom" arrow>
                                        <IconButton>
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {errors?.[name] && (
                                <FormHelperText className={fileUpload.error}>
                                    {errors?.[name]?.message}
                                </FormHelperText>
                            )}

                            {/* Display Existing Files from Backend */}
                            {existingFiles.length > 0 && (
                                <>
                                    <Typography variant="subtitle2" className={fileUpload.filesSectionTitle}>
                                        Existing File(s):
                                    </Typography>
                                    <Grid container spacing={2} className={fileUpload.filesGrid}>
                                        {existingFiles.map((file, index) => (
                                            <Grid key={`existing-${index}`} size={{ xs: 12, sm: 6, md: 4 }}>
                                                <Paper
                                                    elevation={1}
                                                    className={fileUpload.fileCard}
                                                    onClick={() => openPreview(file)}
                                                >
                                                    <Box className={fileUpload.fileCardHeader}>
                                                        <Box className={fileUpload.fileIconWrapper}>
                                                            {getFileIcon(getFileName(file), 'large')}
                                                        </Box>

                                                        <Box className={fileUpload.fileCardContent}>
                                                            <Typography
                                                                variant="body2"
                                                                className={fileUpload.fileName}
                                                                title={getFileName(file)}
                                                            >
                                                                {getFileName(file)}
                                                            </Typography>

                                                            <Box className={fileUpload.fileMeta}>
                                                                <Chip
                                                                    label={getFileSize(file) || 'Unknown size'}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    className={fileUpload.fileSizeChip}
                                                                />
                                                            </Box>
                                                        </Box>
                                                        <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeSingleFile(index, true, field);
                                                        }}
                                                        className={fileUpload.fileDeleteButton}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                    </Box>
                                                    
                                                    <Box className={fileUpload.fileCardFooter}>
                                                        {canPreviewInBrowser(getFileName(file)) && (
                                                            <Tooltip title="Preview">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openPreview(file);
                                                                    }}
                                                                    className={fileUpload.previewButton}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}

                            {/* Display Newly Selected Files */}
                            {(selectedFiles.length > 0 && (multiple || !shouldShowCircularImage())) && (
                                <>
                                    <Typography variant="subtitle2" className={fileUpload.filesSectionTitle}>
                                        {multiple ? 'Selected File(s):' : 'Selected File:'}
                                    </Typography>
                                    <Grid container spacing={2} className={fileUpload.filesGrid}>
                                        {selectedFiles.map((file, index) => (
                                            <Grid key={`selected-${index}`} size={{ xs: 12, sm: 12, md: 12 }}>
                                                <Paper
                                                    elevation={1}
                                                    className={fileUpload.fileCard}
                                                    onClick={() => openPreview(file)}
                                                >
                                                    <Box className={fileUpload.fileCardHeader}>
                                                        <Box className={fileUpload.fileIconWrapper}>
                                                            {getFileIcon(file.name, 'large')}
                                                        </Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeSingleFile(index, false, field);
                                                            }}
                                                            className={fileUpload.fileDeleteButton}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Box className={fileUpload.fileCardContent}>
                                                        <Typography
                                                            variant="body2"
                                                            className={fileUpload.fileName}
                                                            title={file.name}
                                                        >
                                                            {file.name}
                                                        </Typography>

                                                        {/* <Box className={fileUpload.fileMeta}>
                                                            <Chip 
                                                                label={formatFileSize(file.size)}
                                                                size="small"
                                                                variant="outlined"
                                                                className={fileUpload.fileSizeChip}
                                                            />
                                                        </Box> */}
                                                    </Box>

                                                    {/* <Box className={fileUpload.fileCardFooter}>
                                                        {canPreviewInBrowser(file.name) && (
                                                            <Tooltip title="Preview">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openPreview(file);
                                                                    }}
                                                                    className={fileUpload.previewButton}
                                                                >
                                                                    <VisibilityIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box> */}
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </div>
                    )}
                />

                {/* Preview Modal */}
                <Dialog
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    maxWidth="lg"
                    fullWidth
                    className={fileUpload.previewDialog}
                >
                    <DialogTitle className={fileUpload.previewDialogTitle}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Box display="flex" alignItems="center" gap={1}>
                                {getFileIcon(previewFileName, 'small')}
                                <Typography variant="h6" noWrap flex={1}>
                                    {previewFileName}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <MuiButton
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}
                                    size="small"
                                    className={fileUpload.downloadButton}
                                >
                                    Download
                                </MuiButton>
                                <IconButton
                                    aria-label="close"
                                    onClick={() => setPreviewOpen(false)}
                                    size="small"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </DialogTitle>

                    <DialogContent className={fileUpload.previewDialogContent}>
                        {previewFile && canPreviewInBrowser(previewFileName) ? (
                            <Box className={fileUpload.previewContainer}>
                                {isImageFile(previewFileName) ? (
                                    <Box className={fileUpload.imagePreviewWrapper}>
                                        <img
                                            src={previewFile}
                                            className={fileUpload.imgPreviewPopUp}
                                            alt={previewFileName}
                                        />
                                    </Box>
                                ) : (
                                    <Box className={fileUpload.pdfPreviewWrapper}>
                                        <iframe
                                            src={previewFile}
                                            className={fileUpload.filePreviewPopUp}
                                            title={previewFileName}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box className={fileUpload.unsupportedPreview}>
                                {getFileIcon(previewFileName, 'large')}
                                <Typography variant="h6" className="mt-3">
                                    {previewFileName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" className="mt-2">
                                    This file format cannot be previewed in the browser.
                                </Typography>
                                <MuiButton
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}
                                    className="mt-3"
                                >
                                    Download to View
                                </MuiButton>
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </FormControl>
        </>
    );
}