/** @format */

import * as React from 'react';
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../store/auth.js';
import Cookies from 'js-cookie';

export default function NavBar() {
	const dispatch = useDispatch();
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const user = useSelector((state) => state.auth.user);
	const navigate = useNavigate();

	function _logOut() {
		Cookies.remove('token');
		dispatch(logOut());
		navigate('/login');
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar 
				position="static" 
				sx={{ 
					bgcolor: 'success.main',
					boxShadow: 'none',
					borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
				}}
			>
				<Toolbar sx={{ gap: 2 }}>
					<Typography 
						variant="h6" 
						component={Link} 
						to="/" 
						sx={{ 
							flexGrow: 1,
							textDecoration: 'none',
							color: 'white',
							fontWeight: 600,
							letterSpacing: '-0.5px'
						}}
					>
						SpendSmartly!
					</Typography>

					{isAuthenticated ? (
						<>
							<Button 
								component={Link} 
								to="/category" 
								sx={{ 
									color: 'white',
									'&:hover': {
										bgcolor: 'rgba(255, 255, 255, 0.1)'
									}
								}}
							>
								Categories
							</Button>

							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Typography 
									sx={{ 
										color: 'white',
										display: { xs: 'none', sm: 'block' }
									}}
								>
									{user?.firstName}
								</Typography>
								
								<IconButton 
									onClick={_logOut}
									sx={{ 
										color: 'white',
										'&:hover': {
											bgcolor: 'rgba(255, 255, 255, 0.1)'
										}
									}}
								>
									<LogoutIcon />
								</IconButton>
							</Box>
						</>
					) : (
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Button 
								component={Link} 
								to="/login" 
								variant="text"
								sx={{ 
									color: 'white',
									'&:hover': {
										bgcolor: 'rgba(255, 255, 255, 0.1)'
									}
								}}
							>
								Login
							</Button>
							<Button 
								component={Link} 
								to="/register" 
								variant="contained"
								sx={{ 
									bgcolor: 'white',
									color: 'success.main',
									'&:hover': {
										bgcolor: 'rgba(255, 255, 255, 0.9)'
									}
								}}
							>
								Register
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}
