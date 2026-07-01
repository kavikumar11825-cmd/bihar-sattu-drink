// Production Mode: OTP Notification Simulator is disabled.
// All OTP codes are sent directly to the user's real email inbox.

export function triggerSimulatedOtp(type: "sms" | "email", target: string, code: string) {
  // Production Mode: No-op. Never display or leak OTP codes on the screen or UI.
  console.log(`[OTP] Production dispatch triggered to ${target} via ${type}. Check actual inbox.`);
}

export default function OtpNotificationSimulator() {
  // Production Mode: Do not render anything in the UI.
  return null;
}
