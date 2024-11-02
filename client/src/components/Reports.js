/** @format */

import React from 'react';
import {
	Chart,
	PieSeries,
	Title,
	Legend,
	Tooltip,
	BarSeries,
	ArgumentAxis,
	ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import { Paper, Typography, Box, Grid, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export default function Reports({ data = [] }) {
	const user = useSelector((state) => state.auth.user);
	const categories = user?.categories || [];

	// Calculate total spending
	const totalSpending = Array.isArray(data) 
		? data.reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0)
		: 0;

	// Initialize the pie chart data
	const pieChartData = categories.map(category => ({
		category: category.label,
		amount: 0
	}));

	// Process category spending
	if (Array.isArray(data)) {
		data.forEach((transaction) => {
			const category = categories.find(cat => cat._id === transaction.category_id);
			if (category) {
				const chartItem = pieChartData.find(item => item.category === category.label);
				if (chartItem) {
					chartItem.amount += Number(transaction.amount) || 0;
				}
			}
		});
	}

	// Process monthly spending
	const monthlyData = Array.isArray(data) ? data.reduce((acc, transaction) => {
		const month = dayjs(transaction.date).format('MMM YYYY');
		acc[month] = (acc[month] || 0) + (Number(transaction.amount) || 0);
		return acc;
	}, {}) : {};

	const barChartData = Object.entries(monthlyData).map(([month, amount]) => ({
		month,
		amount
	})).sort((a, b) => dayjs(a.month, 'MMM YYYY').diff(dayjs(b.month, 'MMM YYYY')));

	// If there's no data, show a message
	if (!data.length) {
		return (
			<Paper 
				sx={{ 
					p: 3,
					borderRadius: 3,
					boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
				}}
			>
				<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
					Financial Reports
				</Typography>
				<Box sx={{ py: 4, textAlign: 'center' }}>
					<Typography color="text.secondary">
						No data available. Add some transactions to see your financial reports.
					</Typography>
				</Box>
			</Paper>
		);
	}

	return (
		<Grid container spacing={3}>
			{/* Total Spending Summary */}
			<Grid item xs={12}>
				<Paper 
					sx={{ 
						p: 3,
						borderRadius: 3,
						boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
						bgcolor: 'success.main',
						color: 'white',
					}}
				>
					<Stack spacing={1}>
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Total Spending
						</Typography>
						<Typography variant="h4" sx={{ fontWeight: 700 }}>
							${totalSpending.toFixed(2)}
						</Typography>
					</Stack>
				</Paper>
			</Grid>

			{/* Category Spending (Pie Chart) */}
			<Grid item xs={12} md={6}>
				<Paper 
					sx={{ 
						p: 3,
						borderRadius: 3,
						boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
						height: '100%',
					}}
				>
					<Chart data={pieChartData}>
						<PieSeries
							valueField="amount"
							argumentField="category"
						/>
						<Title 
							text="Spending by Category"
							textComponent={({ text }) => (
								<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
									{text}
								</Typography>
							)}
						/>
						<Animation />
						<Legend />
						<Tooltip 
							contentComponent={({ text, ...props }) => (
								<div {...props}>
									${Number(text).toFixed(2)}
								</div>
							)}
						/>
					</Chart>
				</Paper>
			</Grid>

			{/* Monthly Spending (Bar Chart) */}
			<Grid item xs={12} md={6}>
				<Paper 
					sx={{ 
						p: 3,
						borderRadius: 3,
						boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
						height: '100%',
					}}
				>
					<Chart data={barChartData}>
						<ArgumentAxis />
						<ValueAxis />
						<BarSeries
							valueField="amount"
							argumentField="month"
						/>
						<Title
							text="Monthly Spending"
							textComponent={({ text }) => (
								<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
									{text}
								</Typography>
							)}
						/>
						<Animation />
						<Tooltip 
							contentComponent={({ text, ...props }) => (
								<div {...props}>
									${Number(text).toFixed(2)}
								</div>
							)}
						/>
					</Chart>
				</Paper>
			</Grid>
		</Grid>
	);
}
