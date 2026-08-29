import { Order, Subscription } from '../types';

/**
 * WhatsApp Notification Templates for Milad Drinking Water (মিলাদ ড্রিংকিং ওয়াটার)
 * Specially formatted for Bangladesh & Sylhet customers with clear Bengali & English text.
 */

export interface DriverDispatchInfo {
  name?: string;
  phone?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNo: string;
  estimatedArrival?: string;
}

/**
 * 1. Order Placed & Jar Deposit Status Template
 */
export function generateOrderPlacedTemplate(order: Order, appUrl = 'https://miladdrinkingwater.bd'): string {
  const itemsList = order.items
    .map((item) => `• *${item.quantity}x ${item.name}* (${item.volume}) - ৳${item.totalPrice}`)
    .join('\n');

  // Jar Deposit Breakdown
  const emptyJarsCount = order.emptyJarsReturnedCount || 0;
  const jarDepositNotice = emptyJarsCount > 0
    ? `♻️ *খালি জার বদল (Jar Exchange):* ${emptyJarsCount}টি জার বদল (৳${emptyJarsCount * 250} ডিপোজিট চার্জ মওকুফ ✅)`
    : order.depositTotal > 0
    ? `⚠️ *নতুন জার সিকিউরিটি জামানত:* ৳${order.depositTotal} (জার ফেরত দিলে এই টাকা ফেরতযোগ্য)`
    : `ℹ️ *জার এক্সচেঞ্জ:* কোনো অতিরিক্ত জামানতের প্রয়োজন নেই`;

  const paymentText = order.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : order.paymentMethod.toUpperCase();
  const paymentStatusText = order.paymentStatus === 'paid' ? 'পরিশোধিত (PAID ✅)' : 'বকেয়া / ক্যাশ অন ডেলিভারি ⏳';

  return `🌊 *মিলাদ ড্রিংকিং ওয়াটার - অর্ডার নিশ্চিতকরণ* 🌊
-------------------------------------
সম্মানিত গ্রাহক *${order.customerName}*,

মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) বেছে নেওয়ার জন্য ধন্যবাদ! আপনার বিশুদ্ধ পানির অর্ডারটি প্রস্তুত করা হচ্ছে।

📋 *ইনভয়েস নং:* #${order.invoiceNumber}
📅 *ডেলিভারির তারিখ:* ${order.deliveryDate}
⏰ *সময়:* ${order.timeSlot}
📍 *ডেলিভারি ঠিকানা:* ${order.deliveryAddress.addressLine}, ${order.deliveryAddress.area}, সিলেট

🛒 *অর্ডার বিবরণ:*
${itemsList}

💵 *মোট বিল:* ৳${order.totalAmount} (${paymentStatusText} via ${paymentText})
${jarDepositNotice}

🔬 *আমাদের পানির বৈশিষ্ট্য:*
• ৭-ধাপ বিশিষ্ট RO + UV ফিল্ট্রেশন এবং ওজোন নির্বীজিত
• টিডিএস (TDS) < ৩৫ PPM এবং ব্যালেন্সড পিএইচ ৭.৪

📞 সরাসরি কল বা হোয়াটসঅ্যাপ করুন: +8801711102448
📍 কারখানা ও বিক্রয় কেন্দ্র: মিরবক্সটুলা, সিলেট, বাংলাদেশ
✉️ ইমেইল: miladdrinkingwater@gmail.com`;
}

/**
 * 2. Driver Dispatch / Out For Delivery Template
 */
export function generateDriverDispatchTemplate(
  order: Order,
  driverInfo?: DriverDispatchInfo
): string {
  const driverSource = driverInfo || order.assignedDriver;
  const driverName = driverSource?.name || (driverSource as any)?.driverName || 'কবির হোসেন';
  const driverPhone = driverSource?.phone || (driverSource as any)?.driverPhone || '+8801711102448';
  const vehicleNo = driverSource?.vehicleNo || 'সিলেট মেট্রো-ড ১১-২২৩৩';
  const estimatedArrival = (driverSource as any)?.estimatedArrival || order.timeSlot || '৩০-৪৫ মিনিট';

  const emptyJarReminder = (order.emptyJarsReturnedCount || 0) > 0
    ? `\n⚠️ *স্মরণ করিয়ে দিচ্ছি:* ডেলিভারি ম্যানের জন্য *${order.emptyJarsReturnedCount}টি খালি ২০ লিটার জার* প্রস্তুত রাখুন।`
    : '';

  return `🚚 *মিলাদ ড্রিংকিং ওয়াটার - ডেলিভারি ভ্যান রওনা হয়েছে!* 🚚
-------------------------------------
প্রিয় গ্রাহক *${order.customerName}*,

আপনার পানির অর্ডারটি (#${order.invoiceNumber}) আমাদের মিরবক্সটুলা কারখানা থেকে রওনা হয়েছে!

👤 *ডেলিভারি চালক:* ${driverName}
📞 *চালকের মোবাইল:* ${driverPhone}
🚐 *গাড়ি নম্বর:* ${vehicleNo}
⏱️ *আনুমানিক সময়:* ${estimatedArrival}

📍 *গন্তব্য:* ${order.deliveryAddress.addressLine}, ${order.deliveryAddress.area}, সিলেট
💵 *টাকার পরিমাণ:* ৳${order.totalAmount} (${order.paymentStatus === 'paid' ? 'অনলাইনে পরিশোধিত' : 'ক্যাশ অন ডেলিভারি'})
${emptyJarReminder}

🔒 প্রতিটি জারে আমাদের জেনুইন হলোগ্রাম সিল চেক করে নিন।

📞 সরাসরি হেল্পলাইন: +8801711102448 (মিরবক্সটুলা, সিলেট)`;
}

/**
 * 3. Subscription Delivery Reminder
 */
export function generateSubscriptionReminderTemplate(
  sub: Subscription,
  deliveryDateStr?: string
): string {
  return `🔔 *মিলাদ ড্রিংকিং ওয়াটার - নিয়মিত রিফিল রিমাইন্ডার* 🔔
-------------------------------------
সম্মানিত গ্রাহক *${sub.customerName}*,

আপনার নিয়মিত নির্ধারিত পানির ডেলিভারি আগামীকালের শিডিউলে রয়েছে:

📅 *তারিখ:* ${deliveryDateStr || sub.nextDeliveryDate}
⏰ *সময়:* ${sub.timeSlot}
💧 *পরিমাণ:* ${sub.quantityPerDelivery}টি ২০ লিটার জার
📍 *ঠিকানা:* ${sub.deliveryAddress.addressLine}, ${sub.deliveryAddress.area}, সিলেট

♻️ *অনুরোধ:* অনুগ্রহ করে পূর্বের খালি জারগুলো তৈরি রাখুন।
জরুরীতে কল করুন: +8801711102448
মিলাদ ড্রিংকিং ওয়াটার, মিরবক্সটুলা, সিলেট।`;
}

/**
 * 4. Invoice PDF Link & Delivery Completed
 */
export function generateInvoicePdfTemplate(
  order: Order,
  invoicePdfUrl?: string,
  appUrl = 'https://miladdrinkingwater.bd'
): string {
  const directLink = invoicePdfUrl || `${appUrl}?view=invoice&id=${order.id}`;

  return `🧾 *মিলাদ ড্রিংকিং ওয়াটার - ডেলিভারি সম্পন্ন ও রসিদ* 🧾
-------------------------------------
প্রিয় গ্রাহক *${order.customerName}*,

আপনার অর্ডার *#${order.invoiceNumber}* সফলভাবে ডেলিভারি সম্পন্ন হয়েছে!

💰 *পরিশোধিত টাকা:* ৳${order.totalAmount}
💳 *পেমেন্ট:* ${order.paymentMethod.toUpperCase()} (${order.paymentStatus === 'paid' ? 'পরিশোধিত ✅' : 'বকেয়া'})
📅 *ডেলিভারির তারিখ:* ${order.deliveryDate}
💧 *পানির মান:* টিডিএস < ৩৫ PPM | ১০০% ফুড-গ্রেড জীবাণুমুক্ত জার

মিলাদ ড্রিংকিং ওয়াটারের সাথে থাকার জন্য ধন্যবাদ!
যেকোনো প্রয়োজনে কল বা হোয়াটসঅ্যাপ: +8801711102448
📍 মিরবক্সটুলা, সিলেট | miladdrinkingwater@gmail.com`;
}
