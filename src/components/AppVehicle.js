import React from "react";
import Label from "./feeds/formLabel";
import "bootstrap";
import { dataCollection } from "./feeds/common";

export default class App_vehicle extends React.Component {
	state = {
		vehicleType: "CAR",
		fuelExcuse: {
			CAR: {
				ptr: " d-inline-block",
				dsl: " d-inline-block",
			},
			"3WHEEL": {
				ptr: " d-inline-block",
				dsl: " d-none",
			},
			VAN: {
				ptr: " d-none",
				dsl: " d-inline-block",
			},
			LORRY: {
				ptr: " d-none",
				dsl: " d-inline-block",
			},
			BIKE: {
				ptr: " d-inline-block",
				dsl: " d-none",
			},
			BUS: {
				ptr: " d-none",
				dsl: " d-inline-block",
			},
		},
		data: {
			validity: false,
		}
	};

	handleVehicleTypeChange = (type) => {
		document.querySelector("#react_endpoint-2-1 > div:nth-child(8) > button:nth-child(1)").classList.remove('select');
		document.querySelector("#react_endpoint-2-1 > div:nth-child(8) > button:nth-child(2)").classList.remove('select');
		this.setState({ vehicleType: type });
	};

	componentDidMount() {
		document.querySelector("#react_endpoint-2-1 > div:nth-child(10) > button.btn.btn-warning.w-100").addEventListener('click', this.vehicleDataValidation);
		document.getElementById("flexCheckDefault").addEventListener('change', this.handleAgreementChange);
	}

	handleGoBack = () => {
		document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'flex';
		setTimeout(() => {
			document.querySelector("#registration > div.mb-3 > span:nth-child(2)").classList.remove("active");
			document.querySelector("#react_endpoint-1-1").classList.remove('d-none');
			document.querySelector("#react_endpoint-1-1").classList.add('d-block');
			document.querySelector("#react_endpoint-2-1").classList.remove('d-block');
			document.querySelector("#react_endpoint-2-1").classList.add('d-none');
			dataCollection.personal.newValidation = true;
			setTimeout(() => {
				document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none';
			}, 1000);
		}, 1500)
	};

	handleFuelTypeChange = (event) => {
		const petrol = document.querySelector("#react_endpoint-2-1 > div:nth-child(8) > button:nth-child(1)");
		const diesel = document.querySelector("#react_endpoint-2-1 > div:nth-child(8) > button:nth-child(2)");
		petrol.classList.remove('select');
		diesel.classList.remove('select');
		event.target.classList.add('select');
	}

	handleAgreementChange = () => {
		const agreement = document.getElementById("flexCheckDefault").checked;
		if (agreement) {
			document.querySelector("#react_endpoint-2-1 > div:nth-child(10) > button.btn.btn-warning.w-100").disabled = false;
		} else {
			document.querySelector("#react_endpoint-2-1 > div:nth-child(10) > button.btn.btn-warning.w-100").disabled = true;
		}
	}

	vehicleDataValidation = () => {
		document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'flex';
		if (this.state.data.validity) {
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 500)
			return
		}

		const key = document.querySelector("#react_endpoint-2-1 > div:nth-child(2) > input.form-control.w-25").value;
		const number = document.querySelector("#react_endpoint-2-1 > div:nth-child(2) > input.form-control.w-75").value;
		const cNumber = document.querySelector("#react_endpoint-2-1 > div:nth-child(6) > input").value;
		var fuelType = undefined;
		try {
			fuelType = document.querySelector("#react_endpoint-2-1 > div:nth-child(8) .select").innerText;
		} catch {
			fuelType = undefined;
		}

		if (key.length > 0 && key.length < 4 && (/^\d+$/.test(key) || /^[A-Za-z]+$/.test(key))) {
			if (key.length == 1) {
				if (/^\d+$/.test(key)) {
					dataCollection.vehicle.key = key;
					this.setState({ data: { validity: true } });
				} else {
					console.log("Invalied Key 1-1")
					this.setState({ data: { validity: false } });
					setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
					return
				}
			} else {
				if (/^[A-Za-z]+$/.test(key) && key.length > 1) {
					dataCollection.vehicle.key = key;
					this.setState({ data: { validity: true } });
				} else {
					console.log("Invalied Key 1-2")
					this.setState({ data: { validity: false } });
					setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
					return
				}
			}
		} else {
			console.log("Invalied Key 2-1")
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (number.length > 0 && number.length < 5 && /^\d+$/.test(number)) {
			dataCollection.vehicle.number = number;
			this.setState({ data: { validity: true } });
		} else {
			console.log("Invalied Number")
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (cNumber.length > 0 && cNumber.length == 10) {
			dataCollection.vehicle.cNumber = cNumber;
			this.setState({ data: { validity: true } });
		} else {
			console.log("Invalied Chassis")
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		if (fuelType !== undefined && (fuelType == "PETROL" || fuelType == "DIESEL")) {
			dataCollection.vehicle.fuelType = fuelType;
			this.setState({ data: { validity: true } });
		} else {
			console.log("Invalied Fuel")
			this.setState({ data: { validity: false } });
			setTimeout(() => { document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none'; }, 1000)
			return
		}

		dataCollection.vehicle.kind = this.state.vehicleType;
		setTimeout(() => {
			document.querySelector("#react_endpoint-2-1").style.display = 'none';
			document.querySelector("#register").classList.add('d-none');
			document.querySelector("#endpage").classList.remove('d-none');
			document.querySelector("#register > div.modal-backdrop.fade.show.loading-box").style.display = 'none';
			console.log('Registration complete.')
		}, 2000)

	}

	render() {
		return (
			<React.Fragment>
				<Label value="Vehicle Number" require="true"></Label>
				<div className="form-group">
					<input
						className="form-control w-25 transform-uppercase "
						type="text"
						placeholder="Ex: ABC"
						maxLength={3}
						autoComplete={false}
						required
					></input>
					<input
						className="form-control w-75"
						type="text"
						placeholder="Ex: 1234"
						maxLength={4}
						autoComplete={false}
						required
					></input>
				</div>
				<Label value="Vehicle Type" require="true"></Label>
				<div className="form-group">
					<button
						className="btn btn-outline-secondary dropdown-toggle form-control"
						type="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="true"
					>
						{this.state.vehicleType}
					</button>
					<div className="dropdown-menu">
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("CAR")}
						>
							CAR
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("3WHEEL")}
						>
							3WHEEL
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("VAN")}
						>
							VAN
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("LORRY")}
						>
							LORRY
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("BIKE")}
						>
							BIKE
						</a>
						<a
							className="dropdown-item"
							onClick={() => this.handleVehicleTypeChange("BUS")}
						>
							BUS
						</a>
					</div>
				</div>
				<Label value="Chassis Number" require="true"></Label>
				<div className="form-group">
					<input
						className="form-control transform-uppercase"
						type="text"
						placeholder="Ex: N786543322"
						maxLength={10}
						autoComplete={false}
						required
					></input>
				</div>
				<Label value="Select Fuel Type" require="true"></Label>
				<div className="form-group">
					<button
						type="button"
						className={
							"btn btn-outline-secondary" +
							this.state.fuelExcuse[this.state.vehicleType]["ptr"]
						}
						onClick={this.handleFuelTypeChange}
					>
						PETROL
					</button>
					<button
						type="button"
						className={
							"btn btn-outline-secondary" +
							this.state.fuelExcuse[this.state.vehicleType]["dsl"]
						}
						onClick={this.handleFuelTypeChange}
					>
						DIESEL
					</button>
				</div>
				<div className="form-group form-check">
					<input
						className="form-check-input"
						type="checkbox"
						value=""
						id="flexCheckDefault"
						autoComplete={false}
					></input>
					<label className="form-check-label" htmlFor="flexCheckDefault">
						I agree to the <a href="#">Terms and Conditions</a>
					</label>
				</div>
				<div>
					<button type="button" className="btn btn-warning w-100" disabled>
						Register
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary w-100 mt-2"
						onClick={this.handleGoBack}
					>
						Back
					</button>
				</div>
			</React.Fragment>
		);
	}
}
