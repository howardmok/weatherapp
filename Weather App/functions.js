window.onload = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			searchLatLon(position.coords.latitude, position.coords.longitude);
		});
	}
	let fahrCels = document.querySelector('#fahrCels');
	fahrCels.innerHTML = "Change to Celsius";
};

let changeMetric = () => {
	if (fahrCels.innerHTML === "Change to Celsius") {
		let temperatureEle = document.querySelector('#temperature');
		let temperature = parseFloat(temperatureEle.innerHTML);
		temperatureEle.innerHTML = (temperature - 32) * 5 / 9;
		fahrCels.innerHTML = "Change to Fahrenheit"; 
	} else {
		let temperatureEle = document.querySelector('#temperature');
		let temperature = parseFloat(temperatureEle.innerHTML);
		temperatureEle.innerHTML = temperature * 9 / 5 + 32;
		fahrCels.innerHTML = "Change to Celsius"; 
	}
}

let searchCity = () => {
	let query = "?q=" + document.querySelector('#city').value + "&appid=7730967cf865f73df013b70a8be67a1a";
	fetch("http://api.openweathermap.org/data/2.5/weather" + query).then((data) => {
		return data.json();
	}).then(results => {
		let temperature = document.querySelector('#temperature');
		let humidity = document.querySelector('#humidity');
		let pressure = document.querySelector('#pressure');
		let location = document.querySelector('#location');
		location.innerHTML = "city " + document.querySelector('#city').value;
		temperature.innerHTML = results.main.temp;
		humidity.innerHTML = results.main.humidity;
		pressure.innerHTML = results.main.pressure;
		setLocal(location, temperature, humidity, pressure);
	}).catch(error => {
		alert("Please enter a valid city");
	});
};

let searchLatLon = (lat, lon) => {
	if (lat === undefined && lon === undefined) {
		lat = document.querySelector('#lat').value;
		lon = document.querySelector('#lon').value
	}
	let query = "?lat=" + lat + "&lon=" + lon + "&appid=7730967cf865f73df013b70a8be67a1a";
	fetch("http://api.openweathermap.org/data/2.5/weather" + query).then((data) => {
		return data.json();
	}).then(results => {
		let temperature = document.querySelector('#temperature');
		let humidity = document.querySelector('#humidity');
		let pressure = document.querySelector('#pressure');
		let location = document.querySelector('#location');
		location.innerHTML = "latitude " + lat + ' and longitude ' + lon;
		temperature.innerHTML = results.main.temp;
		humidity.innerHTML = results.main.humidity;
		pressure.innerHTML = results.main.pressure;
		setLocal(location, temperature, humidity, pressure);
	}).catch(error => {
		alert("Please enter a valid latitude and longitude");
	});
};

let searchZIP = () => {
	let query = "?zip=" + document.querySelector('#zip').value + ",us" + "&appid=7730967cf865f73df013b70a8be67a1a";
	fetch("http://api.openweathermap.org/data/2.5/weather" + query).then((data) => {
		return data.json();
	}).then(results => {
		let temperature = document.querySelector('#temperature');
		let humidity = document.querySelector('#humidity');
		let pressure = document.querySelector('#pressure');
		let location = document.querySelector('#location');
		location.innerHTML = "ZIP code " + document.querySelector('#zip').value;
		temperature.innerHTML = results.main.temp;
		humidity.innerHTML = results.main.humidity;
		pressure.innerHTML = results.main.pressure;
		setLocal(location, temperature, humidity, pressure);
	}).catch(error => {
		alert("Please enter a valid ZIP code");
	});
};

let setLocal = (location, temperature, humidity, pressure) => {
	let obj = {
		location: location.innerHTML,
		temperature: temperature.innerHTML,
		pressure: pressure.innerHTML,
		humidity: humidity.innerHTML
	};
	if (localStorage['recent']) {
		let savedItems = JSON.parse(localStorage['recent']);
		if (savedItems.length === 3) {
			savedItems.shift();
		}
		savedItems.push(obj);
		localStorage.setItem('recent', JSON.stringify(savedItems));
	} else {
		let savedItems = [];
		savedItems.push(obj);
		localStorage.setItem('recent', JSON.stringify(savedItems));
	}
	document.querySelector('#recent').innerHTML = createList(JSON.parse(localStorage['recent']));
}; 

let createList = (recentData) => {
	let ele = `<ul>${recentData.map(entry => 
		`<li>Location: ${entry.location} - Temperature: ${entry.temperature} - Humidity: ${entry.humidity} - Pressure: ${entry.pressure}</li>`)}
		</ul>`;
	return ele;
};