import React, { Component } from 'react'
import { Layout, PageHeader, Input, Button, Typography } from 'antd'
import './App.css'
import 'antd/dist/antd.css'
import Transaction from './components/Transaction/Transaction'
import Balance from './components/Balance/Balance'
import axios from 'axios'

const { Content } = Layout
const { Title } = Typography
const host = `${window.location.protocol}//${window.location.hostname}`

interface AppState {
	latestTransaction: string[]
}

class App extends Component<{}, AppState> {
	constructor(props: {}) {
		super(props)
		this.state = { latestTransaction: [] }
		this.getTransaction()
		setInterval(() => {
			this.getTransaction()
		}, 5000)
	}

	async getTransaction() {
		let result = await axios.get(`${host}/api/tx_hashes`)
		this.setState({ latestTransaction: result.data })
	}

	render() {
		let transaction = this.state.latestTransaction.map(tx => <Transaction key={tx} txHash={tx}></Transaction>)

		return (
			<Layout className='layout flex'>
				<Content style={{ padding: '0 50px', marginTop: 64, marginBottom: 64, minHeight: '100vh' }}>
					<Balance />
					<Title>Latest Transaction</Title>
					<div className='transaction-container'>{transaction}</div>
				</Content>
			</Layout>
		)
	}
}

export default App
