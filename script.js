window.addEventListener('load', function () {
    let myLatLng = { lat: 49.98821775383394, lng: 36.23271625625523 };

    const map = new google.maps.Map(document.getElementById("map"),
        {
            mapTypeControl: false,
            center: myLatLng,
            zoom: 13,
        }
    );

    let inputFromPlace = document.getElementById('fromPlaces');
    let inputToPlace = document.getElementById('toPlaces');

    const options = {
        componentRestrictions: { country: "ua" },
        fields: ["address_components", "geometry"],
        types: ["address"],
    }

    const autocompleteFromField = new google.maps.places.Autocomplete(inputFromPlace, options);
    const autocompleteToField = new google.maps.places.Autocomplete(inputToPlace, options);

    inputFromPlace.focus();

    let resultField = document.getElementById('result');
    let resultFieldDistance = document.getElementById('resultDistance');
    let resultFieldDuration = document.getElementById('resultDuration');

    let form = document.getElementById('formDestination');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (inputFromPlace.value.trim() !== "" && inputToPlace.value.trim() !== "") {
            calcRoute();
        }
    });

    let directionsService = new google.maps.DirectionsService();

    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    function calcRoute() {
        let origin = inputFromPlace.value;
        let destination = inputToPlace.value;

        let request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.metric
        }

        directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                resultField.innerHTML = "";
                resultFieldDistance.innerHTML = result.routes[0].legs[0].distance.text + " (" + result.routes[0].legs[0].distance.value + ")";
                resultFieldDuration.innerHTML = result.routes[0].legs[0].duration.text + " (" + result.routes[0].legs[0].duration.value + ")";

                directionsRenderer.setDirections(result);
            } else  {
                directionsRenderer.setDirections({routes: []})

                map.setCenter(myLatLng);

                resultField.innerHTML = "ERROR";
            }
        });
    }
})

