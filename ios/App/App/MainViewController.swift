//
//  MainViewController.swift
//  App
//
//  Created by Nicholson Galela on 2026/05/24.
//


import UIKit
import Capacitor

class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()

        print("✅ MainViewController capacitorDidLoad")
        bridge?.registerPluginInstance(PatelaQposPlugin())
        print("✅ PatelaQposPlugin manually registered")
    }
}
