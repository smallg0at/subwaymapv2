import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import * as React from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '@mui/material/Modal';
import GitHubIcon from '@mui/icons-material/GitHub';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(600px, 90vw)',
    maxHeight: '60vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
    overflow: "auto",
    zIndex: 12222
};

export default function AboutModal() {
    const [isModalOpen, setModalOpen] = React.useState(false)
    const handleOpen = () => setModalOpen(true)
    const handleClose = () => setModalOpen(false)
    return (
        <React.Fragment>
            <IconButton aria-label="about" onClick={handleOpen} variant="filled">
                <InfoOutlinedIcon />
            </IconButton>
            <Modal
                open={isModalOpen}
                onClose={handleClose}
                sx={{ zIndex: 12221 }}
            >
                <Box sx={style}>
                    <Typography gutterBottom variant="h4">北京地铁图</Typography>
                    <Typography gutterBottom variant="h5">Copyright YC L, 2023</Typography>
                    <Typography gutterBottom variant="body1">1.1.0</Typography>
                    <Link href="https://github.com/smallg0at/subwaymapv2" target="_blank" rel="noopener" gutterBottom>
                        <Button startIcon={<GitHubIcon />}>GitHub</Button>
                    </Link>
                    <Divider sx={{ marginBottom: '20px' }}></Divider>
                    <Typography gutterBottom variant="h5">算法说明</Typography>
                    <Typography gutterBottom variant="body1">路程最短：仅考虑列车路程时路程最短</Typography>
                    <Typography gutterBottom variant="body1">速度最快：（推荐）综合时间最快</Typography>
                    <Typography gutterBottom variant="body1">换乘最少：在换乘次数最少的基础上做到时间最短</Typography>
                    <Typography gutterBottom variant="body1">另外，考虑价格时没有考虑机场线、有轨电车。</Typography>
                    <Typography gutterBottom variant="h5">如何购买北京地铁定期票</Typography>
                    <Typography gutterBottom variant="body1">请下载亿通行 App 购买北京轨道交通定期票。<br />
                        北京轨道交通定期票为电子票，一日票票价为20元/张，二日票票价为30元/张，三日票票价为40元/张，五日票票价为70元/张，七日票票价为90元/张。在使用有效期内限单人不限次使用，无超时、超程限制。</Typography>
                    <Typography gutterBottom variant="h5">旅游票定价规范</Typography>
                    <Typography gutterBottom variant="body1">对于里程在 13139m 以上的路程，按 13139m 路程计价。</Typography>
                    <Typography gutterBottom variant="body1">实际上，按照实际情况，这种票本来就不应该存在。</Typography>
                    <Typography gutterBottom variant="h5">定期票定价规范</Typography>
                    <Typography gutterBottom variant="body1">你都给定期票付过钱了那当然价格为0啊！</Typography>
                    <Typography gutterBottom variant="h5">协议</Typography>
                    <Link href="https://github.com/smallg0at/subwaymapv2/blob/master/LICENSE" underline="hover" target="_blank" rel="noopener" gutterBottom>
                        <Typography gutterBottom variant="body1" style={{ marginBottom: '15px' }}>Modified MIT License</Typography>
                    </Link>
                </Box>
            </Modal>
        </React.Fragment>
    )
}