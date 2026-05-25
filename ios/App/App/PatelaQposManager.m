#import "PatelaQposManager.h"
#import <CoreBluetooth/CoreBluetooth.h>

@interface PatelaQposManager ()

@property (nonatomic, strong) QPOSService *pos;
@property (nonatomic, strong) BTDeviceFinder *btFinder;

@property (nonatomic, strong) CAPPluginCall *paymentCall;
@property (nonatomic, strong) CAPPluginCall *scanCall;
@property (nonatomic, strong) CAPPluginCall *batteryCall;

@property (nonatomic, weak) CAPPlugin *plugin;

@property (nonatomic, copy) NSString *bluetoothName;
@property (nonatomic, copy) NSString *amountInCents;
@property (nonatomic, copy) NSString *currencyCode;
@property (nonatomic, copy) NSString *reference;
@property (nonatomic, copy) NSString *scanNameFilter;

@property (nonatomic, strong) NSMutableArray<NSString *> *discoveredQposDevices;

@property (nonatomic, assign) BOOL autoApproveTestMode;
@property (nonatomic, assign) BOOL transactionStarted;
@property (nonatomic, assign) BOOL hasFinished;

@end

@implementation PatelaQposManager

+ (instancetype)shared {
    static PatelaQposManager *sharedInstance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        sharedInstance = [[PatelaQposManager alloc] init];
    });

    return sharedInstance;
}

- (instancetype)init {
    self = [super init];

    if (self) {
        self.pos = [QPOSService sharedInstance];
        [self.pos setDelegate:self];
        [self.pos setQueue:nil];
        [self.pos setPosType:PosType_BLUETOOTH_2mode];

        self.transactionStarted = NO;
        self.hasFinished = NO;
        self.discoveredQposDevices = [NSMutableArray new];
    }

    return self;
}

#pragma mark - Helpers

- (void)rejectCall:(CAPPluginCall *)call message:(NSString *)message {
    if (!call) {
        return;
    }

    SEL rejectSelector = NSSelectorFromString(@"reject:");
    SEL rejectWithMessageSelector = NSSelectorFromString(@"rejectWithMessage:");
    SEL errorSelector = NSSelectorFromString(@"error:");

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"

    if ([call respondsToSelector:rejectSelector]) {
        [call performSelector:rejectSelector withObject:message];
        return;
    }

    if ([call respondsToSelector:rejectWithMessageSelector]) {
        [call performSelector:rejectWithMessageSelector withObject:message];
        return;
    }

    if ([call respondsToSelector:errorSelector]) {
        [call performSelector:errorSelector withObject:message];
        return;
    }

#pragma clang diagnostic pop

    [call resolve:@{
        @"status": @"failed",
        @"message": message ?: @"Patela QPOS error."
    }];
}

- (void)resolvePaymentOnce:(NSDictionary *)data {
    if (self.hasFinished) {
        return;
    }

    self.hasFinished = YES;

    if (self.paymentCall) {
        [self.paymentCall resolve:data ?: @{}];
        self.paymentCall = nil;
    }
}

- (void)rejectPaymentOnce:(NSString *)message {
    if (self.hasFinished) {
        return;
    }

    self.hasFinished = YES;

    if (self.paymentCall) {
        [self rejectCall:self.paymentCall message:message ?: @"Patela QPOS error."];
        self.paymentCall = nil;
    }
}

- (void)notifyEvent:(NSDictionary *)data {
    if (self.plugin) {
        [self.plugin notifyListeners:@"patelaQposEvent" data:data ?: @{}];
    }
}

- (NSString *)stringFromValue:(id)value {
    if (value == nil || value == [NSNull null]) {
        return @"";
    }

    if ([value isKindOfClass:[NSString class]]) {
        return (NSString *)value;
    }

    if ([value respondsToSelector:@selector(stringValue)]) {
        return [value stringValue];
    }

    return [NSString stringWithFormat:@"%@", value];
}

- (NSInteger)integerBatteryValueFromInfo:(NSDictionary *)posInfoData {
    NSArray *possibleKeys = @[
        @"batteryPercentage",
        @"batteryLevel",
        @"battery",
        @"power",
        @"batteryPercent"
    ];

    for (NSString *key in possibleKeys) {
        id value = posInfoData[key];
        NSString *stringValue = [self stringFromValue:value];

        if (stringValue.length > 0) {
            NSInteger number = [stringValue integerValue];

            if (number >= 0 && number <= 100) {
                return number;
            }
        }
    }

    return -1;
}

#pragma mark - Scan Devices

- (void)scanDevicesWithCall:(CAPPluginCall *)call
                    timeout:(NSInteger)timeout
                 nameFilter:(NSString *)nameFilter {

    NSLog(@"PatelaQpos scanDevices timeout=%ld filter=%@",
          (long)timeout,
          nameFilter);

    self.scanCall = call;
    self.scanNameFilter = nameFilter ?: @"";
    self.discoveredQposDevices = [NSMutableArray new];

    if (self.btFinder == nil) {
        self.btFinder = [BTDeviceFinder new];
    }

    [self.btFinder setBluetoothDelegate2Mode:self];

    CBCentralManagerState state = [self.btFinder getCBCentralManagerState];

    NSLog(@"PatelaQpos bluetooth state=%ld", (long)state);

    if (state == CBCentralManagerStatePoweredOff) {
        [self rejectCall:call message:@"Bluetooth is powered off."];
        self.scanCall = nil;
        return;
    }

    NSInteger finalTimeout = timeout > 0 ? timeout : 15;

    [self.btFinder scanQPos2Mode:finalTimeout];

    dispatch_after(
        dispatch_time(DISPATCH_TIME_NOW, (int64_t)(finalTimeout * NSEC_PER_SEC)),
        dispatch_get_main_queue(),
        ^{
            [self finishScanQPos2Mode];
        }
    );
}

#pragma mark - Battery

- (void)getBatteryWithCall:(CAPPluginCall *)call
             bluetoothName:(NSString *)bluetoothName {

    NSLog(@"PatelaQpos getBattery bluetoothName=%@", bluetoothName);

    self.batteryCall = call;

    self.pos = [QPOSService sharedInstance];
    [self.pos setDelegate:self];
    [self.pos setQueue:nil];
    [self.pos setPosType:PosType_BLUETOOTH_2mode];
    [self.pos setBTAutoDetecting:YES];

    BOOL didStartConnect = [self.pos connectBT:bluetoothName];

    if (!didStartConnect) {
        [self rejectCall:call message:@"QPOS SDK failed to connect for battery check."];
        self.batteryCall = nil;
        return;
    }

    dispatch_after(
        dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)),
        dispatch_get_main_queue(),
        ^{
            NSLog(@"PatelaQpos requesting QPOS info for battery");
            [self.pos getQPosInfo];
        }
    );
}

#pragma mark - Payment

- (void)startPaymentWithCall:(CAPPluginCall *)call
               bluetoothName:(NSString *)bluetoothName
               amountInCents:(NSString *)amountInCents
                currencyCode:(NSString *)currencyCode
                   reference:(NSString *)reference
         autoApproveTestMode:(BOOL)autoApproveTestMode
                      plugin:(CAPPlugin *)plugin {

    if (self.paymentCall != nil) {
        [self rejectCall:call message:@"Another Patela payment is already in progress."];
        return;
    }

    self.paymentCall = call;
    self.plugin = plugin;

    self.bluetoothName = bluetoothName;
    self.amountInCents = amountInCents;
    self.currencyCode = currencyCode ?: @"0710";
    self.reference = reference ?: @"";
    self.autoApproveTestMode = autoApproveTestMode;

    self.transactionStarted = NO;
    self.hasFinished = NO;

    NSLog(@"PatelaQpos startPayment bluetoothName=%@ amountInCents=%@ currency=%@ reference=%@ autoApprove=%@",
          self.bluetoothName,
          self.amountInCents,
          self.currencyCode,
          self.reference,
          self.autoApproveTestMode ? @"YES" : @"NO");

    self.pos = [QPOSService sharedInstance];
    [self.pos setDelegate:self];
    [self.pos setQueue:nil];
    [self.pos setPosType:PosType_BLUETOOTH_2mode];
    [self.pos setBTAutoDetecting:YES];

    BOOL didStartConnect = [self.pos connectBT:self.bluetoothName];

    if (!didStartConnect) {
        [self rejectPaymentOnce:@"QPOS SDK failed to start Bluetooth connection."];
    }
}

- (void)disconnect {
    NSLog(@"PatelaQpos disconnect");

    if (self.pos) {
        [self.pos disconnectBT];
    }

    self.paymentCall = nil;
    self.scanCall = nil;
    self.batteryCall = nil;
    self.transactionStarted = NO;
    self.hasFinished = NO;
}

- (void)startTrade {
    if (self.transactionStarted) {
        return;
    }

    self.transactionStarted = YES;

    NSLog(@"PatelaQpos startTrade");

    [self.pos setCardTradeMode:CardTradeMode_SWIPE_TAP_INSERT_CARD];

    /*
     This should make the terminal show tap / insert / swipe flow.
    */
    [self.pos doCheckCard:30];
}

#pragma mark - QPOSServiceListener

- (void)onRequestQposConnected {
    NSLog(@"PatelaQpos onRequestQposConnected");

    if (self.batteryCall) {
        dispatch_after(
            dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)),
            dispatch_get_main_queue(),
            ^{
                NSLog(@"PatelaQpos requesting QPOS info after battery connection");
                [self.pos getQPosInfo];
            }
        );

        return;
    }

    [self startTrade];
}

- (void)onRequestQposDisconnected {
    NSLog(@"PatelaQpos onRequestQposDisconnected");

    if (self.paymentCall && !self.hasFinished) {
        [self rejectPaymentOnce:@"Patela device disconnected."];
    }
}

- (void)onRequestNoQposDetected {
    NSLog(@"PatelaQpos onRequestNoQposDetected");

    if (self.batteryCall) {
        [self rejectCall:self.batteryCall message:@"No Patela/QPOS device detected for battery check."];
        self.batteryCall = nil;
        return;
    }

    [self rejectPaymentOnce:@"No Patela/QPOS device detected."];
}

- (void)onRequestSetAmount {
    NSLog(@"PatelaQpos onRequestSetAmount amount=%@ currency=%@",
          self.amountInCents,
          self.currencyCode);

    /*
     Amount format:
     R20.00 = 2000
     R200.00 = 20000

     South Africa ZAR:
     0710
    */
    [self.pos setAmount:self.amountInCents
        aAmountDescribe:self.reference ?: @""
               currency:self.currencyCode ?: @"0710"
        transactionType:TransactionType_GOODS];
}

- (void)onDoTradeResult:(DoTradeResult)result DecodeData:(NSDictionary *)decodeData {
    NSLog(@"PatelaQpos onDoTradeResult result=%ld data=%@",
          (long)result,
          decodeData);

    if (result == DoTradeResult_NO_RESPONSE) {
        [self rejectPaymentOnce:@"No card response. Please try again."];
        return;
    }

    if (result == DoTradeResult_BAD_SWIPE) {
        [self rejectPaymentOnce:@"Bad card swipe. Please try again."];
        return;
    }

    if (result == DoTradeResult_TRY_ANOTHER_INTERFACE) {
        [self rejectPaymentOnce:@"Please try another card interface."];
        return;
    }

    if (result == DoTradeResult_CARD_NOT_SUPPORT) {
        [self rejectPaymentOnce:@"Card not supported."];
        return;
    }
}

- (void)onRequestWaitingUser {
    NSLog(@"PatelaQpos onRequestWaitingUser");

    [self notifyEvent:@{
        @"event": @"waiting_user"
    }];
}

- (void)onRequestPinEntry {
    NSLog(@"PatelaQpos onRequestPinEntry");

    [self notifyEvent:@{
        @"event": @"pin_entry"
    }];
}

- (void)onRequestFinalConfirm {
    NSLog(@"PatelaQpos onRequestFinalConfirm");

    [self.pos finalConfirm:YES];
}

- (void)onRequestOnlineProcess:(NSString *)tlv {
    NSLog(@"PatelaQpos onRequestOnlineProcess tlv=%@", tlv);

    [self notifyEvent:@{
        @"event": @"online_process_required",
        @"tlv": tlv ?: @""
    }];

    /*
     TEST ONLY:
     This sends demo approval response.

     Production must send TLV to your acquiring/payment host and pass the real host response back.
    */
    if (self.autoApproveTestMode) {
        NSLog(@"PatelaQpos TEST MODE auto approving online process");
        [self.pos sendOnlineProcessResult:@"8A023030"];
    } else {
        [self rejectPaymentOnce:@"Online processing is required. Send the TLV to your payment host/acquirer."];
    }
}

- (void)onRequestTransactionResult:(TransactionResult)transactionResult {
    NSLog(@"PatelaQpos onRequestTransactionResult result=%ld", (long)transactionResult);

    NSString *status = @"unknown";
    NSString *message = @"Transaction result received.";

    switch (transactionResult) {
        case TransactionResult_APPROVED:
            status = @"approved";
            message = @"Payment approved.";
            break;

        case TransactionResult_DECLINED:
            status = @"declined";
            message = @"Payment declined.";
            break;

        case TransactionResult_CANCEL:
            status = @"cancelled";
            message = @"Payment cancelled.";
            break;

        case TransactionResult_TERMINATED:
            status = @"terminated";
            message = @"Payment terminated.";
            break;

        case TransactionResult_CONTACTLESS_TRANSACTION_NOT_ALLOW:
            status = @"failed";
            message = @"Contactless transaction is not allowed.";
            break;

        case TransactionResult_MULTIPLE_CARDS:
            status = @"failed";
            message = @"Multiple cards detected. Please tap only one card.";
            break;

        case TransactionResult_CARD_NOT_SUPPORTED:
            status = @"failed";
            message = @"Card not supported.";
            break;

        default:
            status = @"unknown";
            message = [NSString stringWithFormat:@"Transaction result: %ld", (long)transactionResult];
            break;
    }

    [self resolvePaymentOnce:@{
        @"status": status,
        @"message": message,
        @"transactionResult": @(transactionResult)
    }];
}

- (void)onRequestDisplay:(Display)displayMsg {
    NSLog(@"PatelaQpos onRequestDisplay display=%ld", (long)displayMsg);

    NSString *message = @"display";

    switch (displayMsg) {
        case Display_PLEASE_WAIT:
            message = @"Please wait.";
            break;

        case Display_REMOVE_CARD:
            message = @"Remove card.";
            break;

        case Display_PROCESSING:
            message = @"Processing.";
            break;

        case Display_TRY_ANOTHER_INTERFACE:
            message = @"Try another interface.";
            break;

        case Display_INPUT_PIN_ING:
            message = @"Enter PIN.";
            break;

        default:
            message = [NSString stringWithFormat:@"Display: %ld", (long)displayMsg];
            break;
    }

    [self notifyEvent:@{
        @"event": @"display",
        @"message": message,
        @"code": @(displayMsg)
    }];
}

- (void)onQposInfoResult:(NSDictionary *)posInfoData {
    NSLog(@"PatelaQpos onQposInfoResult=%@", posInfoData);

    NSInteger battery = [self integerBatteryValueFromInfo:posInfoData];

    NSString *batteryPercentage = [self stringFromValue:posInfoData[@"batteryPercentage"]];
    NSString *batteryLevel = [self stringFromValue:posInfoData[@"batteryLevel"]];
    NSString *isCharging = [self stringFromValue:posInfoData[@"isCharging"]];

    NSDictionary *result = @{
        @"battery": @(battery),
        @"batteryPercentage": batteryPercentage ?: @"",
        @"batteryLevel": batteryLevel ?: @"",
        @"isCharging": isCharging ?: @"",
        @"raw": posInfoData ?: @{}
    };

    if (self.batteryCall) {
        [self.batteryCall resolve:result];
        self.batteryCall = nil;
        return;
    }

    [self notifyEvent:@{
        @"event": @"battery",
        @"battery": @(battery),
        @"batteryPercentage": batteryPercentage ?: @"",
        @"batteryLevel": batteryLevel ?: @"",
        @"isCharging": isCharging ?: @""
    }];
}

- (void)onError:(Error)errorState {
    NSLog(@"PatelaQpos onError error=%ld", (long)errorState);

    if (self.batteryCall) {
        [self rejectCall:self.batteryCall message:[NSString stringWithFormat:@"QPOS battery error: %ld", (long)errorState]];
        self.batteryCall = nil;
        return;
    }

    [self rejectPaymentOnce:[NSString stringWithFormat:@"QPOS error: %ld", (long)errorState]];
}

- (void)onDHError:(DHError)errorState {
    NSLog(@"PatelaQpos onDHError error=%ld", (long)errorState);

    if (self.batteryCall) {
        [self rejectCall:self.batteryCall message:[NSString stringWithFormat:@"QPOS battery DH error: %ld", (long)errorState]];
        self.batteryCall = nil;
        return;
    }

    [self rejectPaymentOnce:[NSString stringWithFormat:@"QPOS DH error: %ld", (long)errorState]];
}

#pragma mark - BTDeviceFinder BluetoothDelegate2Mode

- (void)onBluetoothName2Mode:(NSString *)bluetoothName {
    NSLog(@"PatelaQpos onBluetoothName2Mode=%@", bluetoothName);

    if (bluetoothName == nil || bluetoothName.length == 0) {
        return;
    }

    if (self.discoveredQposDevices == nil) {
        self.discoveredQposDevices = [NSMutableArray new];
    }

    if (![self.discoveredQposDevices containsObject:bluetoothName]) {
        [self.discoveredQposDevices addObject:bluetoothName];
    }
}

- (void)finishScanQPos2Mode {
    NSLog(@"PatelaQpos finishScanQPos2Mode");

    if (!self.scanCall) {
        return;
    }

    NSMutableArray *devices = [NSMutableArray new];

    if (self.btFinder) {
        NSArray *sdkDevices = [self.btFinder getAllOnlineQPosName2Mode] ?: @[];

        for (NSString *deviceName in sdkDevices) {
            if ([deviceName isKindOfClass:[NSString class]] &&
                deviceName.length > 0 &&
                ![devices containsObject:deviceName]) {
                [devices addObject:deviceName];
            }
        }

        [self.btFinder stopQPos2Mode];
    }

    for (NSString *deviceName in self.discoveredQposDevices ?: @[]) {
        if ([deviceName isKindOfClass:[NSString class]] &&
            deviceName.length > 0 &&
            ![devices containsObject:deviceName]) {
            [devices addObject:deviceName];
        }
    }

    NSMutableArray *filteredDevices = [NSMutableArray new];

    for (NSString *deviceName in devices) {
        if (![deviceName isKindOfClass:[NSString class]]) {
            continue;
        }

        if (self.scanNameFilter.length > 0) {
            if ([deviceName rangeOfString:self.scanNameFilter options:NSCaseInsensitiveSearch].location == NSNotFound) {
                continue;
            }
        }

        [filteredDevices addObject:deviceName];
    }

    NSLog(@"PatelaQpos scan result devices=%@", filteredDevices);

    [self.scanCall resolve:@{
        @"devices": filteredDevices,
        @"count": @([filteredDevices count])
    }];

    self.scanCall = nil;
}

- (void)bluetoothIsPowerOff2Mode {
    NSLog(@"PatelaQpos bluetoothIsPowerOff2Mode");

    if (self.scanCall) {
        [self rejectCall:self.scanCall message:@"Bluetooth is powered off."];
        self.scanCall = nil;
    }
}

- (void)bluetoothIsPowerOn2Mode {
    NSLog(@"PatelaQpos bluetoothIsPowerOn2Mode");
}

@end
