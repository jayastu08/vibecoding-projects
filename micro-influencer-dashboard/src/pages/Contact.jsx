import { useState } from 'react';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const subjects = [
  'General Inquiry',
  'Feature Request',
  'Bug Report',
  'Partnership Opportunity',
  'Billing Question',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.subject) errs.subject = 'Select a subject';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-surface-900">Contact Us</h2>
          <p className="text-sm text-surface-500 mt-1">We'll get back to you within 24 hours.</p>
        </div>
        <Card>
          <CardBody className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-success-100 flex items-center justify-center text-success-600 mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-900">Message sent!</h3>
            <p className="text-sm text-surface-500 mt-1 max-w-sm">
              Thanks {form.name.split(' ')[0]}, we've received your message. Our team will review it and respond at <strong className="text-surface-700">{form.email}</strong>.
            </p>
            <Button variant="secondary" className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); setErrors({}); }}>
              Send another message
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">Contact Us</h2>
        <p className="text-sm text-surface-500 mt-1">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" placeholder="Your name" value={form.name} onChange={set('name')} error={errors.name} />
              <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} error={errors.email} />
            </div>

            <Select label="Subject" value={form.subject} onChange={set('subject')} error={errors.subject}>
              <option value="">Select a subject</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-surface-700">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us more about your inquiry..."
                value={form.message}
                onChange={set('message')}
                className={`
                  w-full px-3 py-2 rounded-lg border bg-white text-surface-900
                  placeholder:text-surface-400 text-sm resize-y min-h-[100px]
                  transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
                  ${errors.message ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : 'border-surface-200'}
                `}
              />
              {errors.message && <span className="text-xs text-danger-600">{errors.message}</span>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button type="submit" variant="primary">Send Message</Button>
              <Button type="reset" variant="ghost" onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setErrors({}); }}>
                Clear
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Email', value: 'hello@influencerroi.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { label: 'Response time', value: 'Within 24 hours', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Support hours', value: 'Mon–Fri, 9am–6pm EST', icon: 'M12 2v20M2 12h20' },
        ].map((item) => (
          <Card key={item.label}>
            <CardBody className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-surface-500">{item.label}</p>
                <p className="text-sm font-medium text-surface-900">{item.value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
