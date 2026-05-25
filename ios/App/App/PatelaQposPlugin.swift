import Foundation
import Capacitor

@objc(PatelaQposPlugin)
public class PatelaQposPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PatelaQposPlugin"
    public let jsName = "PatelaQpos"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "ping", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "scanDevices", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getBattery", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startPayment", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "disconnect", returnType: CAPPluginReturnPromise)
    ]

    public override func load() {
        print("✅ PatelaQposPlugin loaded into Capacitor")
    }

    @objc func ping(_ call: CAPPluginCall) {
        print("✅ PatelaQpos ping called")

        call.resolve([
            "ok": true,
            "message": "PatelaQpos native plugin is working"
        ])
    }

    @objc func scanDevices(_ call: CAPPluginCall) {
        print("✅ PatelaQpos scanDevices called")

        let timeout = call.getInt("timeout") ?? 15
        let nameFilter = call.getString("nameFilter") ?? ""

        PatelaQposManager.shared()?.scanDevices(
            with: call,
            timeout: timeout,
            nameFilter: nameFilter
        )
    }

    @objc func getBattery(_ call: CAPPluginCall) {
        print("✅ PatelaQpos getBattery called")

        let bluetoothName = call.getString("bluetoothName") ?? ""

        if bluetoothName.isEmpty {
            call.reject("Missing bluetoothName for battery check.")
            return
        }

        PatelaQposManager.shared()?.getBattery(
            with: call,
            bluetoothName: bluetoothName
        )
    }

    @objc func startPayment(_ call: CAPPluginCall) {
        print("✅ PatelaQpos startPayment called")

        let bluetoothName = call.getString("bluetoothName") ?? ""
        let amountInCents = call.getInt("amountInCents") ?? 0
        let currencyCode = call.getString("currencyCode") ?? "0710"
        let reference = call.getString("reference") ?? ""
        let autoApproveTestMode = call.getBool("autoApproveTestMode") ?? false

        if bluetoothName.isEmpty {
            call.reject("Missing bluetoothName. Example: MPOS1011400027")
            return
        }

        if amountInCents <= 0 {
            call.reject("Missing or invalid amountInCents.")
            return
        }

        PatelaQposManager.shared()?.startPayment(
            with: call,
            bluetoothName: bluetoothName,
            amountInCents: "\(amountInCents)",
            currencyCode: currencyCode,
            reference: reference,
            autoApproveTestMode: autoApproveTestMode,
            plugin: self
        )
    }

    @objc func disconnect(_ call: CAPPluginCall) {
        print("✅ PatelaQpos disconnect called")

        PatelaQposManager.shared()?.disconnect()

        call.resolve([
            "disconnected": true
        ])
    }
}
