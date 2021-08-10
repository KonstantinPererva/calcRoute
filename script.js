let listDestination = [
    {
        title: "point 1",
        destination: "49.97223678405526, 36.340848638915524"
    },
    {
        title: "point 2",
        destination: "49.97590586298788, 36.26207112457702"
    },
    {
        title: "point 3",
        destination: "49.938811871872886, 36.35942022550071"
    },
    {
        title: "point 4",
        destination: "49.986443150953555, 36.337692683025224"
    }
];
let center = { lat: 49.98821775383394, lng: 36.23271625625523 };
let form = null;
let inputFromPlace = null;
let errorField = null;
let resultFieldDistance = null;
let resultFieldDuration = null;
let map = null;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"),
        {
            mapTypeControl: false,
            center: center,
            zoom: 13,
        }
    );

    return map;
}

function initForm() {
    form = document.getElementById('formDestination');
    inputFromPlace = document.getElementById('fromPlaces');
    inputFromPlace.focus();

    errorField = document.getElementById('result');
    resultFieldDistance = document.getElementById('resultDistance');
    resultFieldDuration = document.getElementById('resultDuration');
}

function initAutocomplete() {
    const autocompleteFromField = new google.maps.places.Autocomplete(inputFromPlace, {
        componentRestrictions: { country: "ua" },
        fields: ["address_components", "geometry"],
        types: ["address"],
    });
}

window.addEventListener('load', function () {
    initMap();

    initForm();

    initAutocomplete();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        minDistanceToPoint();
    });
    
    function minDistanceToPoint() {
        const p0 = new Promise(((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: inputFromPlace.value,
                destination: listDestination[0].destination,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.metric
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } else {
                    reject((err) => console.log("Error: ", err))
                }
            });
        }))
        .then((result) => {
            return {
                title: listDestination[0].title,
                destination: listDestination[0].destination,
                value: result.routes[0].legs[0].distance.value,
            }
        })

        const p1 = new Promise(((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: inputFromPlace.value,
                destination: listDestination[1].destination,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.metric
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } else {
                    reject((err) => console.log("Error: ", err))
                }
            });
        }))
        .then((result) => {
            return {
                title: listDestination[1].title,
                destination: listDestination[1].destination,
                value: result.routes[0].legs[0].distance.value,
            }
        })

        const p2 = new Promise(((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: inputFromPlace.value,
                destination: listDestination[2].destination,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.metric
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } else {
                    reject((err) => console.log("Error: ", err))
                }
            });
        }))
        .then((result) => {
            return {
                title: listDestination[2].title,
                destination: listDestination[2].destination,
                value: result.routes[0].legs[0].distance.value,
            }
        })

        const p3 = new Promise(((resolve, reject) => {
            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: inputFromPlace.value,
                destination: listDestination[3].destination,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.metric
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } else {
                    reject((err) => console.log("Error: ", err))
                }
            });
        }))
        .then((result) => {
            console.log(result);
            return {
                title: listDestination[3].title,
                destination: listDestination[3].destination,
                value: result.routes[0].legs[0].distance.value,
            }
        })

        Promise.all([p0,p1,p2,p3]).then(values => {
            let name = "";
            let min = values[0].value;
            let dest = "";

            for (let i = 0; i < values.length; i++) {
                console.log(values[i]);
                if (min > values[i].value) {
                    name = values[i].title;
                    dest = values[i].destination;
                    min = values[i].value;
                }
            }

            console.log(name, dest, min);

            let directionsService = new google.maps.DirectionsService();

            directionsService.route({
                origin: inputFromPlace.value,
                destination: dest,
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.metric
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    errorField.innerHTML = "Ближайшая точка - " + name;
                    resultFieldDistance.innerHTML = result.routes[0].legs[0].distance.text + " (" + result.routes[0].legs[0].distance.value + ")";
                    resultFieldDuration.innerHTML = result.routes[0].legs[0].duration.text + " (" + result.routes[0].legs[0].duration.value + ")";

                    let directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(result);
                } else  {
                    errorField.innerHTML = "ERROR";
                }
            });
        });
    }
})

