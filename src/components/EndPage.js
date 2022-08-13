import React from "react";
import "bootstrap";
import "./feeds/endpage.css";
import QRCode from "qrcode";
import { dataCollection } from "./feeds/common";

export default class EndPage extends React.Component {
	state = {
		vehicle: {
			type: "",
			number: "",
			code: "",
		},
		fuelQuota: {
			CAR: {
				egb: 0.0,
				bal: 0.0,
			},
			"3WHEEL": {
				egb: 0.0,
				bal: 0.0,
			},
			VAN: {
				egb: 0.0,
				bal: 0.0,
			},
			LORRY: {
				egb: 0.0,
				bal: 0.0,
			},
			BIKE: {
				egb: 0.0,
				bal: 0.0,
			},
			BUS: {
				egb: 0.0,
				bal: 0.0,
			},
		},
	};

	componentDidMount = () => {
		const processCatch = setInterval(() => {
			if (dataCollection.qr.exit) {
				clearInterval(processCatch)
			} else {
				if (dataCollection.vehicle.key.length != 0 && dataCollection.vehicle.number.length != 0 && dataCollection.vehicle.kind.length != 0 && dataCollection.vehicle.cNumber.length != 0 && dataCollection.vehicle.fuelType.length != 0) {
					try {
						this.generateCode();
					} catch {
						console.log('Attempt failed.');
					}
				}
			}
		}, 100)
	}

	generateCode = () => {
		this.state.vehicle.type = dataCollection.vehicle.kind;
		this.state.vehicle.number = (dataCollection.vehicle.key + "-" + dataCollection.vehicle.number).toUpperCase();
		this.state.vehicle.code = (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)).slice(2, 14).toUpperCase();
		dataCollection.qr.code = this.state.vehicle.code;
		console.log(dataCollection);
		try {
			document.querySelector("#quotaDetails > span.opacity-5").innerText = this.state.vehicle.number;
			document.querySelector("#quotaDetails > span:nth-child(3)").innerText = "Eligible Weekly Quota: " + this.state.fuelQuota[this.state.vehicle.type]["egb"].toFixed(3) + " L";
			document.querySelector("#quotaDetails > span:nth-child(5)").innerText = "Balance Weekly Quota: " + this.state.fuelQuota[this.state.vehicle.type]["bal"].toFixed(3) + " L";
		} catch {
			console.log('Update failed');
		}

		var vehicleNumber = this.state.vehicle.number;
		var vehicleCode = this.state.vehicle.code;
		QRCode.toCanvas(
			vehicleNumber + " | " + vehicleCode,
			{ errorCorrectionLevel: "H", width: 300, margin: 5 },
			function (err, canvas) {
				if (err) throw err;

				var container = document.getElementById("QRcontainer");
				container.innerHTML = "";
				container.appendChild(canvas);
				var canvas = document.querySelector("#QRcontainer > canvas");
				var ctx = canvas.getContext("2d");
				ctx.font = "16px Calibri";
				ctx.textAlign = "center";
				ctx.fillText(vehicleNumber, canvas.width / 2, 25);
				ctx.fillText(vehicleCode, canvas.width / 2, canvas.height - 15);
				dataCollection.qr.exit = true;
			}
		);
	};

	downloadQR = () => {
		var link = document.getElementById("link");
		var canvas = document.querySelector("#QRcontainer > canvas");
		link.setAttribute("download", this.state.vehicle.number + ".png");
		link.setAttribute(
			"href",
			canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
		);
		link.click();
	};

	render() {
		return (
			<React.Fragment>
				<div id="QRcontainer"></div>
				<div id="quotaDetails">
					<span className="opacity-5"></span>
					<br />
					<span>
					</span>
					<br />
					<span>
					</span>
				</div>
				<button type="button" className="btn btn-primary w-50">
					Send QR to my Mobile
				</button>
				<br />
				<button
					type="button"
					className="btn btn-success w-50"
					onClick={this.downloadQR}
				>
					Download QR
				</button>
				<a id="link" className="d-none"></a>
			</React.Fragment>
		);
	}
}
