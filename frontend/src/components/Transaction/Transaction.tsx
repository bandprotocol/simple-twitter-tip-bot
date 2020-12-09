import React, { Component } from 'react'
import { Client } from 'bandchain2.js'
import axios from 'axios'
import './Transaction.css'

interface TransactionState {
	fromAddr?: string
	toAddr?: string
	amount?: number
}

interface TransactionProps {
	txHash: string
}

class Transaction extends Component<TransactionProps, TransactionState> {
	constructor(props: TransactionProps) {
		super(props)
		this.getTransactionInfo(this.props.txHash)
		this.state = {}
	}

	async getTransactionInfo(txHash: string) {
		let result
		try {
			result = await axios.get(`https://guanyu-testnet3-query.bandchain.org/txs/${txHash}`)
		} catch (err) {
			return
		}

		const message = result?.data.tx.value.msg.filter((x: any) => x.type === 'cosmos-sdk/MsgSend')[0]

		console.log('message', message)
		this.setState({
			fromAddr: message?.value.from_address,
			toAddr: message?.value.to_address,
			amount: message?.value.amount[0].amount,
		})
		console.log('transaction state', this.state)
	}

	render() {
		return this.state.fromAddr ? (
			<div className='transactionitem-container'>
				<div className='item'>
					<div className='title'>from</div>
					<div>{this.state.fromAddr}</div>
				</div>
				<div className='item'>
					<div className='title'>to</div>
					<div>{this.state.toAddr}</div>
				</div>
				<div className='item'>
					<div className='title'>amount</div>
					<div>{`${(this.state.amount ?? 0) / 1000000} BAND`}</div>
				</div>
			</div>
		) : (
			<div className='transactionitem-container'>
				<div className='item'>
					<div className='title'>status</div>
					<div>Loading</div>
				</div>
			</div>
		)
		// return (
		// 	<div className='transactionitem-container'>
		// 		<div className='item'>
		// 			<div className='title'>from</div>
		// 			<div>{this.state.fromAddr}</div>
		// 		</div>
		// 		<div className='item'>
		// 			<div className='title'>to</div>
		// 			<div>{this.state.toAddr}</div>
		// 		</div>
		// 		<div className='item'>
		// 			<div className='title'>amount</div>
		// 			<div>{`${(this.state.amount ?? 0) / 1000000} BAND`}</div>
		// 		</div>
		// {this.state.fromAddr ? (
		// 	<div className='transactionitem-container'>
		// 		<div className='item'>
		// 			<div className='title'>from</div>
		// 			<div>{this.state.fromAddr}</div>
		// 		</div>
		// 		<div className='item'>
		// 			<div className='title'>to</div>
		// 			<div>{this.state.toAddr}</div>
		// 		</div>
		// 		<div className='item'>
		// 			<div className='title'>amount</div>
		// 			<div>{`${(this.state.amount ?? 0) / 1000000} BAND`}</div>
		// 		</div>
		// 	</div>
		// ) : (
		// 	<div />
		// )}
		// 	</div>
		// )
	}
}
export default Transaction
