import { useState, FormEvent } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: '',
      email: '',
      message: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="app-contact">
      <div className="contact-header">
        <h2>Get In Touch</h2>
        <p>I would love to hear from you</p>
      </div>

      {submitted ? (
        <div className="contact-success">
          <CheckCircle size={48} />
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. I will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-group">
            <label htmlFor="contact-name" className="form-label">
              <User size={18} />
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span id="name-error" className="form-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact-email" className="form-label">
              <Mail size={18} />
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your.email@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-label">
              <MessageSquare size={18} />
              Message
            </label>
            <textarea
              id="contact-message"
              className={`form-textarea ${errors.message ? 'error' : ''}`}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Your message here..."
              rows={6}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <span id="message-error" className="form-error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <button type="submit" className="form-submit">
            <Send size={18} />
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactApp;
