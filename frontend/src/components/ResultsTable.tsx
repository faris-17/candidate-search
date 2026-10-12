import type { Candidate } from '../types';
import { formatDate } from '../utils/format';

export default function ResultsTable({ items }: { items: Candidate[] }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Name</th><th>Age</th><th>Gender</th><th>Education</th>
                        <th>Location</th><th>Created</th><th>Last login</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name ?? '—'}</td>
                            <td>{c.age ?? '—'}</td>
                            <td>{c.gender ?? '—'}</td>
                            <td>{c.education ?? '—'}</td>
                            <td>{c.location ?? '—'}</td>
                            <td>{formatDate(c.createdAt)}</td>
                            <td>{formatDate(c.lastLoginAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}