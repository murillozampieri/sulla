/**
 * Middleware between web api driver and whatsappJS.
 * Right now this file should not import nor export anything.
 * Until I figure out how to compile this file with the imports inlined.
 * Specifically the [ExposedFn] enum.
 * Maybe by creating a webpack/rollup task
 */
var ExposedFn;
(function (ExposedFn) {
    ExposedFn["OnMessage"] = "onMessage";
    ExposedFn["OnAck"] = "onAck";
    ExposedFn["OnParticipantsChanged"] = "onParticipantsChanged";
})(ExposedFn || (ExposedFn = {}));
/**
 * Exposes [OnMessage] function
 */
WAPI.waitNewMessages(false, function (data) {
    data.forEach(function (message) {
        window[ExposedFn.OnMessage](message);
    });
});
WAPI.waitNewAcknowledgements(function (data) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    data.forEach(function (message) {
        if (window[ExposedFn.OnAck])
            window[ExposedFn.OnAck](message);
    });
});
