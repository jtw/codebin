function getLast10PostHeaders() {

	jQuery.ajax({
        type: "GET",
        url: "/posts/last10",
        success: function (newView) {

            debugger;
        },
        error: function (req, status, error) {
            alert("Error: " + error);
        }
    });

}