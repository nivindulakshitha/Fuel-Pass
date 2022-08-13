import React from "react";
import Label from "./feeds/formLabel";
import "bootstrap";
import { dataCollection } from "./feeds/common";

export default class App_personal extends React.Component {
	state = {
		idType: "NIC",
		idTypeSamples: {
			NIC: "895675466V",
			Passport: "AB012345",
			BRN: "PV 00123456",
		},
		otp: {
			process: false,
			sent: false,
			timeout: true,
			verified: false,
			value: 0,
		},
		data: {
			validity: false,
		}
	};

	handlePhoneInput = (event) => {
		if (event.target.value.length == 10 && this.state.otp.process === false && /^\d+$/.test(event.target.value) && this.state.otp.sent == false && this.state.otp.timeout == true) {
			dataCollection.personal.phone = event.target.value;
			document.querySelector("#otp-process").disabled = false;
		} else {
			document.querySelector("#otp-process").disabled = true;
		}
	}

	handleOTPVerify = () => {
		document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'flex';
		const inserted = document.querySelector("#otp-input").value.replace(/\s/g, '');
		if (/^\d+$/.test(inserted) && parseInt(inserted) == parseInt(this.state.otp.value)) {
			let statusCopy = Object.assign({}, this.state);
			statusCopy.otp.verified = true;
			statusCopy.otp.process = true;
			this.setState(statusCopy);

			document.querySelector("#react_endpoint-1-1 > div:nth-child(7) > input:nth-child(1)").disabled = false;
			document.querySelector("#react_endpoint-1-1 > div:nth-child(7) > input:nth-child(2)").disabled = false;
			document.querySelector("#react_endpoint-1-1 > div:nth-child(9) > input").disabled = false;
			document.querySelector("#react_endpoint-1-1 > div:nth-child(10) > button").disabled = false;
			console.log('OTP Verified.')
		} else {
			document.querySelector("#otp-input").value = '';
		}
		setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 500)
	};

	handleOTPSend = (event) => {
		if (this.state.otp.sent == false && this.state.otp.timeout && this.state.otp.verified == false) {
			document.querySelector("#otp-process").disabled = true;
			document.querySelector("#phone-input").disabled = true;
			let statusCopy = Object.assign({}, this.state);
			statusCopy.otp.value = (Math.floor(Math.random() * 900000) + 100000).toString().substring(0, 6);
			this.setState(statusCopy);

			setTimeout(() => {
				alert("National Fuel Pass:\nOne time validation (OTP) " + this.state.otp.value + "\nExpire in 5 minutes.")
			}, Math.floor((Math.random() * 10) + 1) * 1000)

			statusCopy = Object.assign({}, this.state);
			statusCopy.otp.sent = true;
			this.setState(statusCopy);

			document.querySelector("#otp-input").disabled = false;
			document.querySelector("#otp-verify").disabled = false;

			let seconds = 300;
			var text = "Send OTP " + new Date(seconds * 1000).toISOString().substring(14, 19);
			document.querySelector("#otp-process").innerHTML = text;
			var countDown = setInterval(() => {
				if (this.state.otp.verified) {
					document.querySelector("#otp-process").innerHTML = "Send OTP";
					document.querySelector("#otp-process").disabled = true;
					document.querySelector("#otp-input").disabled = true;
					document.querySelector("#otp-verify").disabled = true;
					document.querySelector("#phone-input").disabled = true;
					clearInterval(countDown);
					return
				} else {
					if (seconds == 0) {
						statusCopy = Object.assign({}, this.state);
						statusCopy.otp.timeout = true;
						statusCopy.otp.sent = false;
						this.setState(statusCopy);
						document.querySelector("#otp-process").innerHTML = "Send OTP";
						document.querySelector("#phone-input").disabled = false;
						document.querySelector("#otp-process").disabled = false;
						document.querySelector("#otp-input").disabled = true;
						document.querySelector("#otp-input").value = '';
						document.querySelector("#otp-verify").disabled = true;
						clearInterval(countDown);
						return
					}
				}
				seconds--
				text = "Send OTP " + new Date(seconds * 1000).toISOString().substring(14, 19);
				document.querySelector("#otp-process").innerHTML = text;
			}, 1000)
		} else {
			console.log("OTP Process is block due to:", this.state.otp);
			document.querySelector("#phone-input").disabled = true;
			document.querySelector("#otp-process").disabled = true;
			document.querySelector("#otp-input").disabled = true;
			document.querySelector("#otp-input").value = '';
			document.querySelector("#otp-verify").disabled = true;
		}
	}

	clientDataValidation = () => {
		document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'flex';
		if (this.state.data.validity && !(dataCollection.personal.newValidation)) {
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 500)
			return
		}

		const nic = document.querySelector("#react_endpoint-1-1 > div:nth-child(2) > input").value;
		const type = this.state.idType;
		const mbNumber = document.querySelector("#phone-input").value;
		const fName = document.querySelector("#react_endpoint-1-1 > div:nth-child(7) > input:nth-child(1)").value;
		const lName = document.querySelector("#react_endpoint-1-1 > div:nth-child(7) > input:nth-child(2)").value;
		const addr = document.querySelector("#react_endpoint-1-1 > div:nth-child(9) > input").value;

		if ((nic.length == 10 || nic.length == 12) && (nic.match(/\d+/g).join("").length == 9 || nic.match(/\d+/g).join("").length == 12)) {
			dataCollection.personal.ID = nic
			this.setState({ data: { validity: true } });
		} else {
			console.log('Invalied ID');
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (mbNumber.length == 10 && /^\d+$/.test(mbNumber) && mbNumber[0] == 0 || this.state.otp.verified) {
			dataCollection.personal.phone = mbNumber;
			this.setState({ data: { validity: true } });
		} else {
			console.log('Invalied Phone');
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (fName.length > 0 && /^[A-Za-z]+$/.test(fName)) {
			dataCollection.personal.fname = fName;
			this.setState({ data: { validity: true } });
		} else {
			console.log('Invalied Name-1');
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (lName.length > 0) {
			if (/^[A-Za-z]+$/.test(lName)) {
				dataCollection.personal.lname = lName;
				this.setState({ data: { validity: true } });
			} else {
				console.log('Invalied Name-2');
				this.setState({ data: { validity: false } });
				setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
				return
			}
		}

		if (addr.length > 0) {
			dataCollection.personal.address = addr;
			this.setState({ data: { validity: true } });
		} else {
			console.log('Invalied Address');
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		document.querySelector("#registration > div.mb-3 > span:nth-child(2)").classList.add("active");
		document.querySelector("#react_endpoint-1-1").classList.remove('d-block');
		document.querySelector("#react_endpoint-1-1").classList.add('d-none');
		document.querySelector("#react_endpoint-2-1").classList.remove('d-none');
		document.querySelector("#react_endpoint-2-1").classList.add('d-block');
		dataCollection.personal.newValidation = false;
		setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 2500)
	};

	componentDidMount() {
		document.getElementById("otp-process").disabled = true;
		document.getElementById("otp-input").disabled = true;
		document.getElementById("otp-verify").disabled = true;
		document.querySelector("#react_endpoint-1-1 > div:nth-child(10) > button").addEventListener('click', (event) => { this.clientDataValidation() });
	}

	handleIdTypeChange = (type) => {
		this.setState({ idType: type });
	};

	render() {
		return (
			<React.Fragment>
				<Label value={this.state.idType + " Number"} require="true"></Label>
				<div className="form-group">
					<input
						className="form-control transform-uppercase w-75"
						type="text"
						maxLength={12}
						placeholder={"Ex: " + this.state.idTypeSamples[this.state.idType]}
						autoComplete="new-password"
						required
					></input>
					<button
						className="btn btn-outline-secondary dropdown-toggle form-control w-25"
						type="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="true"
					>
						{this.state.idType}
					</button>
					<div className="dropdown-menu">
						<a
							className="dropdown-item"
							onClick={() => this.handleIdTypeChange("NIC")}
						>
							NIC
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleIdTypeChange("Passport")}
						>
							Passport
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleIdTypeChange("BRN")}
						>
							BRN
						</a>
					</div>
				</div>
				<div className="label-group">
					<Label value="Mobile Number" require="true"></Label>
					<Label value="OTP" require="true"></Label>
				</div>
				<div className="form-group">
					<input
						className="form-control w-50"
						type="text"
						placeholder="Ex: 0777123456"
						maxLength="10"
						id="phone-input"
						onInput={this.handlePhoneInput}
						autoComplete={false}
						required
					></input>
					<input
						className="form-control w-50"
						type="text"
						placeholder="Ex: 123456"
						maxLength="6"
						id="otp-input"
						autoComplete={false}
						required
					></input>
				</div>
				<div className="form-group">
					<button
						type="button"
						className="btn btn-primary w-50"
						id="otp-process"
						onClick={this.handleOTPSend}
					>
						Send OTP
					</button>
					<button
						type="button"
						className="btn btn-success w-50"
						id="otp-verify"
						onClick={this.handleOTPVerify}
					>
						Verify
					</button>
				</div>
				<div className="label-group">
					<Label value="First Name" require="true"></Label>
					<Label value="Last Name" require="false"></Label>
				</div>
				<div className="form-group">
					<input
						className="form-control w-50 transform-capitalize"
						type="text"
						placeholder="Ex: Saman"
						spellCheck={false}
						autoComplete={false}
						disabled
						required
					></input>
					<input
						className="form-control w-50 transform-capitalize"
						type="text"
						placeholder="Ex: Perera"
						spellCheck={false}
						autoComplete={false}
						disabled
						required
					></input>
				</div>
				<div className="label-group">
					<Label value="Address" require="true"></Label>
				</div>
				<div className="form-group">
					<input
						className="form-control w-100 transform-capitalize"
						type="text"
						placeholder="Ex: 399/8, Station Road, Colombo"
						spellCheck={false}
						autoComplete={false}
						disabled
						required
					></input>
				</div>
				<div className="form-group">
					<button type="button" className="btn btn-warning w-25" disabled>
						Next
					</button>
				</div>
			</React.Fragment>
		);
	}
}
