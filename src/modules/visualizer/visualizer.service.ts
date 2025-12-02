import otpUsageModel from '../../models/otpUsageModel.js';

export const getStats = async (query: any) => {
  const currentYear = new Date().getFullYear();
  const year = Number(query) || currentYear;

  const data = await otpUsageModel.aggregate([
    {
      $match: {
        queriedAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: '$queriedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  const labels = data.map((d) => `${d._id.month}/${year}`);
  const values = data.map((d) => d.count);

  return {
    status: 200,
    message: 'success',
    data: { labels, values },
  };
};
