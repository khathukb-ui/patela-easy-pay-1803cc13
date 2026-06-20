#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
#import "PatelaQposSDK/QPOSService.h"
#import "PatelaQposSDK/BTDeviceFinder.h"

@interface PatelaQposManager : NSObject <QPOSServiceListener, BluetoothDelegate2Mode>

+ (instancetype)shared;

- (void)scanDevicesWithCall:(CAPPluginCall *)call
                    timeout:(NSInteger)timeout
                 nameFilter:(NSString *)nameFilter
    NS_SWIFT_NAME(scanDevices(with:timeout:nameFilter:));

- (void)getBatteryWithCall:(CAPPluginCall *)call
             bluetoothName:(NSString *)bluetoothName
    NS_SWIFT_NAME(getBattery(with:bluetoothName:));

- (void)startPaymentWithCall:(CAPPluginCall *)call
               bluetoothName:(NSString *)bluetoothName
               amountInCents:(NSString *)amountInCents
                currencyCode:(NSString *)currencyCode
                   reference:(NSString *)reference
         autoApproveTestMode:(BOOL)autoApproveTestMode
                      plugin:(CAPPlugin *)plugin
    NS_SWIFT_NAME(startPayment(with:bluetoothName:amountInCents:currencyCode:reference:autoApproveTestMode:plugin:));

- (void)disconnect;

@end
