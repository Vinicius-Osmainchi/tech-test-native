import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Customer, CustomerService } from "../../../data/services/customerService";
import { uiMessages } from "../../../shared/messages";
import { Form } from "antd";

export const useCustomerDetails = (id: string | undefined) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      Promise.resolve().then(() => {
        if (isMounted) setLoading(false);
      });
      return;
    }

    CustomerService.getCustomerById(Number(id))
      .then((data) => {
        if (isMounted) {
          form.setFieldsValue(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(uiMessages.customerLoadFailed);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, form]);

  const onFinish = async (values: Partial<Customer>) => {
    if (!id) return;

    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await CustomerService.updateCustomer(Number(id), values);
      setSuccess(true);

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch {
      setError(uiMessages.customerUpdateFailed);
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    loading,
    saving,
    error,
    success,
    onFinish,
  };
};
