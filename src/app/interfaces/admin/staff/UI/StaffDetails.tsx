// Import Packages
import { Box, Grid, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Import Images
import profileImg from '../../../../../assets/images/defaultImages/profileImg.webp'

// Import Icons
import BackIcon from '@mui/icons-material/Reply'
import EditIcon from "@mui/icons-material/Edit"

// Import Files
import { useGetStaffByIdMutation } from '../service/staffs'
import Loader from '../../../../../shared/components/loader/Loader'
import Card from '../../../../../shared/components/card/Card'
import UserAvatar from '../../../../../shared/components/avatar/Avatar'
import Button from '../../../../../shared/components/button/Button'

export const StaffDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [imageUrl, setImageUrl] = useState('');

    const [getStaffById, { data: staffDetails, isSuccess, isLoading: staffDetailsLoading }] = useGetStaffByIdMutation();

    useEffect(() => {
        getStaffById({ staff_id: id });
    }, [id]);

    // Call get staff by id api initially
    useEffect(() => {
        if (id && isSuccess && staffDetails?.data) {
            (staffDetails?.data?.image_url != null) ? setImageUrl(staffDetails?.data?.image_url) : setImageUrl(profileImg);
        }
    }, [id, staffDetails, isSuccess]);

    // Create a staff details json array with label and value to use map function
    const staffBasicDetails = [
        { label: "First Name", Value: staffDetails?.data?.first_name },
        { label: "Middle Name", Value: staffDetails?.data?.middle_name },
        { label: "Last Name", Value: staffDetails?.data?.last_name },
        { label: "Email", Value: staffDetails?.data?.email },
        { label: "Phone Number", Value: staffDetails?.data?.country_code + ' ' + staffDetails?.data?.mobile }
    ]

    // Navigate Back to Table
    const goBack = () => { navigate("/admin/staff") }

    // Navigate to Form Page to update data
    const editStaff = () => navigate("/admin/staff/form/" + id);

    return (
        <>
            {/* Header */}
            <Box className="headContainer">
                <Box className="text">
                    <Typography variant="h4" className="title">
                        <BackIcon onClick={goBack} fontSize="large" className="back" />
                        Staff Management
                    </Typography>
                    <Typography variant="body2">View Staff Details</Typography>
                </Box>
            </Box>

            {/* Profile Body */}
            {staffDetailsLoading ? <Loader /> : (
                <Box className="bodyContainer py-3">
                    <Grid container spacing={4} className="profileContainer">
                        <Grid size={12}>
                            <Card isGreenCard className="cardPadding" >
                                <Typography variant="h6" color="white" className="profileCardTitle d-flex justify-content-between">
                                    Basic Information<Button variant="text" color="white" onClick={editStaff}><EditIcon fontSize="small" /></Button>
                                </Typography>
                                <Grid container>
                                    <Grid size={{ xs: 12, lg: 8 }} order={{ xs: 2, lg: 1 }} className="profileCard" >
                                        {staffBasicDetails?.map((item, index) => (
                                            <Typography key={index} className="profileRow">
                                                <span className="clientLabel">{item.label}</span>
                                                <span className="colon">:</span>
                                                <span className="clientValue">{item.Value || "-"}</span>
                                            </Typography>
                                        ))}
                                    </Grid>
                                    <Grid size={{ xs: 12, lg: 4 }} order={{ xs: 1, lg: 2 }} className="d-flex align-items-center justify-content-center">
                                        <UserAvatar size={130} name="Profile Image" src={imageUrl} />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </>
    )
}

export default StaffDetails
