(function getData() {
    axios
        .get("/api/data")
        .then((res) => {
            // handle success
            const data = res.data;
            window.data = data.data;
            // console.log(window.data);
        })
        .catch((error) => {
            // handle error
            console.log(error);
            return {}
        })
}())


