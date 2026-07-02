import { Card, CardBody } from '../components/ui';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">Settings</h2>
        <p className="text-sm text-surface-500 mt-1">Configure your dashboard preferences.</p>
      </div>
      <Card>
        <CardBody>
          <p className="text-surface-400 text-center py-12 text-sm">Settings panel coming soon.</p>
        </CardBody>
      </Card>
    </div>
  );
}
