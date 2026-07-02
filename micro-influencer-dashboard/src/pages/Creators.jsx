import { Card, CardBody } from '../components/ui';

export default function Creators() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-surface-900">Creators</h2>
        <p className="text-sm text-surface-500 mt-1">Manage your micro-influencer roster.</p>
      </div>
      <Card>
        <CardBody>
          <p className="text-surface-400 text-center py-12 text-sm">No creators added yet. Upload data to get started.</p>
        </CardBody>
      </Card>
    </div>
  );
}
