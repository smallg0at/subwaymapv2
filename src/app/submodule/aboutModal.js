import { Typography, IconButton, Box, Button, Link, Divider } from "@mui/material"
import * as React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '@mui/material/Modal';
import GitHubIcon from '@mui/icons-material/GitHub';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max(600px, 50vw)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};

export default function AboutModal(props) {
    const [isModalOpen, setModalOpen] = React.useState(false)
    const handleOpen = () => setModalOpen(true)
    const handleClose = () => setModalOpen(false)
    return (
        <React.Fragment>
            <IconButton aria-label="about" size="small" onClick={handleOpen}>
                <InfoOutlinedIcon />
            </IconButton>
            <Modal
                open={isModalOpen}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Typography variant="h4">北京地铁图</Typography>
                    <Typography variant="h5">Copyright YC L, 2023</Typography>
                    <Divider></Divider>
                    <Typography variant="body1">初试 React，做了个蛮正常的东西</Typography>
                    <Typography variant="body1" style={{marginBottom: '15px'}}>LICENSE: MIT License</Typography>
                    <Link href="https://github.com/smallg0at/subwaymapv2" target="_blank" rel="noopener">
                        <Button startIcon={<GitHubIcon />}>GitHub</Button>
                    </Link>
                </Box>
            </Modal>
        </React.Fragment>
    )
}