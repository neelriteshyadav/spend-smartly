/** @format */

import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Cookies from 'js-cookie';
import TransactionChart from '../components/TransactionChart';
import Reports from '../components/Reports';

export default function Home() {
	const [transactions, setTransactions] = useState([]);
	const [editTransaction, setEditTransaction] = useState({});

	useEffect(() => {
		fetchTransactions();
	}, []);

	async function fetchTransactions() {
		const token = Cookies.get('token');
		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { data } = await res.json();
			const transactionsList = data[0]?.transactions || [];
			console.log('Processed transactions:', transactionsList);
			setTransactions(transactionsList);
		} catch (error) {
			console.error('Error fetching transactions:', error);
			setTransactions([]);
		}
	}

	return (
		<Box sx={{ py: 4 }}>
			<Container>
				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}>
						<TransactionForm
							fetchTransactions={fetchTransactions}
							editTransaction={editTransaction}
							setEditTransaction={setEditTransaction}
						/>
					</Grid>
					<Grid
						item
						xs={12}>
						<TransactionList
							data={transactions}
							fetchTransactions={fetchTransactions}
							setEditTransaction={setEditTransaction}
						/>
					</Grid>
					<Grid
						item
						xs={12}>
						<Reports data={transactions} />
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
