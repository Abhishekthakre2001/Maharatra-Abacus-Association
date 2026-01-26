import React, { useState } from "react";

function NfcReader() {
    const [nfcData, setNfcData] = useState("");
    const [error, setError] = useState("");

    const startScan = async () => {
        if (!("NDEFReader" in window)) {
            alert("NFC is not supported on this device or browser");
            return;
        }

        try {
            const ndef = new NDEFReader();
            await ndef.scan();

            ndef.onreading = (event) => {
                alert("NFC -", event)
                console.log("NFC read:", event);
            };

        } catch (err) {
            alert("NFC ERROR-", err)
            console.error("NFC error:", err);
        }
    };


    return (
        <div style={{ padding: 20 }}>
            <h2>NFC Reader</h2>

            <button onClick={startScan}>
                Scan NFC Card
            </button>

            {nfcData && (
                <p><strong>Data:</strong> {nfcData}</p>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </div>
    );
}

export default NfcReader;
