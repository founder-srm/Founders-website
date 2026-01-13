import { cn } from '@/lib/utils';
import React from 'react';

const PrivacyPolicy = () => {

  const privacyStyles = {
    h1Style: "text-5xl tracking-tighter font-semibold",
    h2Style: "text-xl font-medium tracking-right",
    pStyle: "text-md text-muted-foreground mt-2",
  }

  return (
    <div className='p-5 max-w-6xl mx-auto'>
      <h1 className={cn(privacyStyles.h1Style)}>Privacy Policy</h1>
      <p className='test-sm font-medium mt-2 text-muted-foreground'>
        This Privacy Policy outlines how we collect, use, and protect your
        personal information when you use our website.
      </p>
      <div className="space-y-5">
        <section className="mt-7">
          <h2 className={cn(privacyStyles.h2Style)}>1. Information We Collect</h2>
          <p className={cn(privacyStyles.pStyle)}>
            We collect information that you provide to us, such as your name,
            email, company, phone number, etc., when you fill out forms or
            register on our website.
          </p>
        </section>

        <section >
          <h2 className={cn(privacyStyles.h2Style)}>2. How We Use Your Information</h2>
          <p className={cn(privacyStyles.pStyle)}>
            The information we collect is used to:
            <ul >
              <li>Provide you with requested services</li>
              <li>Communicate with you regarding your inquiries</li>
              <li>Improve our services and website functionality</li>
              <li>Send you marketing materials (if you’ve opted in)</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className={cn(privacyStyles.h2Style)}>3. Sharing Your Information</h2>
          <p className={cn(privacyStyles.pStyle)}>
            We do not sell, trade, or rent your personal information to third
            parties. We may share it with trusted service providers who assist us
            in operating our website and conducting our business, as long as they
            agree to keep this information confidential.
          </p>
        </section>

        <section >
          <h2 className={cn(privacyStyles.h2Style)}>4. Data Security</h2>
          <p className={cn(privacyStyles.pStyle)}>
            We take reasonable precautions to protect your information from
            unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section >
          <h2 className={cn(privacyStyles.h2Style)}>5. Cookies</h2>
          <p className={cn(privacyStyles.pStyle)}>
            Our website uses cookies to improve your experience. You can choose to
            disable cookies through your browser settings.
          </p>
        </section>

        <section >
          <h2 className={cn(privacyStyles.h2Style)}>6. Your Rights</h2>
          <p className={cn(privacyStyles.pStyle)}>
            You have the right to:
            <ul>
              <li>Access the personal data we have about you</li>
              <li>Request the correction or deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </p>
        </section>

        <section>
          <h2 className={cn(privacyStyles.h2Style)}>7. Changes to this Privacy Policy</h2>
          <p className={cn(privacyStyles.pStyle)}>
            We may update this Privacy Policy from time to time. We will notify
            you of any significant changes by posting the updated policy on this
            page.
          </p>
        </section>
      </div>

      <footer className='mt-6 text-xs text-muted-foreground'>
        <p>Last updated: January 2026</p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
