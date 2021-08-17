let listDestination = [
    {
        title: "point 1",
        // destination: "49.97223678405526, 36.340848638915524",
        destination: { lat: 49.97223678405526, lng: 36.340848638915524 }
    },
    {
        title: "point 2",
        // destination: "49.97590586298788, 36.26207112457702",
        destination: { lat: 49.97590586298788, lng: 36.26207112457702 }
    },
    {
        title: "point 3",
        // destination: "49.938811871872886, 36.35942022550071",
        destination: { lat: 49.938811871872886, lng: 36.35942022550071 }
    },
    {
        title: "point 4",
        // destination: "49.986443150953555, 36.337692683025224",
        destination: { lat: 49.986443150953555, lng: 36.337692683025224 }
    }
];
let center = { lat: 49.98821775383394, lng: 36.23271625625523 };
let form = null;
let inputFromPlace = null;
let errorField = null;
let resultFieldDistance = null;
let resultFieldDuration = null;
let map = null;
let list = [];

const initMap = () => {
    map = new google.maps.Map(document.getElementById("map"),
        {
            mapTypeControl: false,
            center: center,
            zoom: 12,
        }
    );

    return map;
}

const initMarker = () => {
    for (let i = 0; i < listDestination.length; i++) {
        (num => {
            new google.maps.Marker({
                position: listDestination[num].destination,
                map,
                title: "Point " + num,
            });
        })(i);
    }
}

const initForm = () => {
    form = document.getElementById('formDestination');
    inputFromPlace = document.getElementById('fromPlaces');
    inputFromPlace.focus();

    errorField = document.getElementById('result');
    resultFieldDistance = document.getElementById('resultDistance');
    resultFieldDuration = document.getElementById('resultDuration');
}

const initAutocomplete = () => {
    return  new google.maps.places.Autocomplete(inputFromPlace, {
        componentRestrictions: { country: "ua" },
        fields: ["address_components", "geometry"],
        types: ["address"],
    });
}

const minDistanceToPoint = () => {
    list = [];

    for (let i = 0; i < listDestination.length; i++) {
        ( num => {
            list.push(
                new Promise(((resolve, reject) => {
                    let directionsService = new google.maps.DirectionsService();

                    directionsService.route({
                        origin: inputFromPlace.value,
                        destination: listDestination[num].destination,
                        travelMode: google.maps.TravelMode.DRIVING,
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
                        title: listDestination[num].title,
                        destination: listDestination[num].destination,
                        value: result.routes[0].legs[0].distance.value,
                    }
                })
            )
        })(i)
    }

    Promise.all(list).then(values => {
        let name = values[0].title;
        let min = values[0].value;
        let dest = values[0].destination;

        for (let i = 0; i < values.length; i++) {
            if (min > values[i].value) {
                name = values[i].title;
                dest = values[i].destination;
                min = values[i].value;
            }
        }


        let directionsService = new google.maps.DirectionsService();

        directionsService.route({
            origin: inputFromPlace.value,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING,
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

window.addEventListener('load', function () {
    initMap();
    initMarker();
    initForm();
    initAutocomplete();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        initMap();
        initMarker();
        minDistanceToPoint();
    });
})

