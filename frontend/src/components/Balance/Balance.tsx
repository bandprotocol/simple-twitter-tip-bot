import React, { Component } from 'react'
import { Client, Wallet } from 'bandchain2.js'
import { Typography, Input, Form, Button } from 'antd'
import { ReferenceData } from 'bandchain2.js/lib/cjs/data'
import './Balance.css'
import axios from 'axios'

const { Title } = Typography
const { PrivateKey, Address } = Wallet
const host = `${window.location.protocol}//${window.location.hostname}`
const client = new Client('https://guanyu-testnet3-query.bandchain.org')

interface BalanceState {
	accountName?: string
	balance: number
	referencePrice: ReferenceData[]
	haveAccount: boolean
}

interface AccountForm {
	account: string
}

class Balance extends Component<{}, BalanceState> {
	constructor(props: any) {
		super(props)

		this.state = { balance: 0, referencePrice: [], haveAccount: false }
	}

	render() {
		return (
			<div style={{ marginBottom: 32 }}>
				<div>
					<Title style={{ marginTop: 32 }} className='balance-header'>
						<div>Balance</div>
						<Form name='accountForm' className='form-container' onFinish={this.submitAccountForm}>
							<Form.Item name='account' className='clear-margin'>
								<Input placeholder='twitter account' className='input-form' />
							</Form.Item>
							<div className='input-before'>@</div>
							<Button type='primary' htmlType='submit' className='submit-button'>
								Search
							</Button>
						</Form>
					</Title>
				</div>

				{this.state.haveAccount ? (
					<div className='balanceitem-container'>
						<div className='item-container'>
							<div className='item-currency' style={{ backgroundColor: 'rgb(82, 105, 255)', color: 'white' }}>
								<b>$</b>BAND
							</div>
							<div className='item-balance'>{`${this.state.balance}`}</div>
						</div>
						<div className='item-container'>
							<div className='item-currency' style={{ backgroundColor: '#B45309', color: 'white' }}>
								USD
							</div>
							<div className='item-balance'>{`${(
								(this.state.referencePrice.filter(({ pair }) => pair === 'BAND/USD')[0]?.rate ?? 0) * this.state.balance
							).toFixed(6)}`}</div>
						</div>
						<div className='item-container'>
							<div className='item-currency' style={{ backgroundColor: '#6D28D9', color: 'white' }}>
								<b>$</b>BTC
							</div>
							<div className='item-balance'>{`${(
								(this.state.referencePrice.filter(({ pair }) => pair === 'BAND/BTC')[0]?.rate ?? 0) * this.state.balance
							).toFixed(6)}`}</div>
						</div>
						<div className='item-container'>
							<div className='item-currency' style={{ backgroundColor: '#047857', color: 'white' }}>
								<b>$</b>ETH
							</div>
							<div className='item-balance'>{`${(
								(this.state.referencePrice.filter(({ pair }) => pair === 'BAND/ETH')[0]?.rate ?? 0) * this.state.balance
							).toFixed(6)}`}</div>
						</div>
					</div>
				) : (
					<div>
						No Account <b>{`${this.state.accountName ? `@${this.state.accountName}` : ''}`}</b>
					</div>
				)}
			</div>
		)
	}

	async getReferenceData(): Promise<ReferenceData[]> {
		const data = await client.getReferenceData(['BAND/BTC', 'BAND/ETH', 'BAND/USD'])
		console.log(data)
		return data
	}

	submitAccountForm = async (value: AccountForm) => {
		if (!value.account) {
			this.setState({ accountName: undefined, haveAccount: false })
			return
		}
		const mnemonic = 'examplesalt' + value.account
		const params = new URLSearchParams()
		params.append('account', `@${value.account}`)
		const mne = await axios.post(`${host}/api/account`, params)
		console.log(mne)
		const address = Address.fromAccBech32(mne.data.address)

		if (!address) {
			this.setState({ accountName: undefined, haveAccount: false })
			return
		}

		let account
		let refData: ReferenceData[]
		try {
			;[account, refData] = await Promise.all([client.getAccount(address), this.getReferenceData()])
		} catch (e) {
			console.error(e)
			this.setState({ accountName: value.account, haveAccount: false })
			return
		}

		const balance = (account?.coins[0]?.amount ?? 0) / 1000000
		this.setState({ accountName: value.account, balance, referencePrice: refData!, haveAccount: true })
	}
}
export default Balance
