class GeneralStat:
    def __init__(self, name: str, value: float, rolling_duration: int):
        self.name = name
        self.value = value
        self.rolling_duration = rolling_duration

    def encode(self):
        return {
            'name': self.name,
            'value': self.value,
            'rolling_duration': self.rolling_duration
        }


class HistogramPoint:
    def __init__(self, counts: int, bin: float):
        self.counts = counts
        self.bin = bin

    def encode(self):
        return {
            'counts': self.counts,
            'bins': self.bin
        }


class DescriptiveStats:
    def __init__(self, total_count: int, mean: float, stddev: float, min: float, max: float, quartile1: float,
                 quartile2: float, quartile3: float):
        self.total_count = total_count
        self.mean = mean
        self.stddev = stddev
        self.min = min
        self.max = max
        self.quartile1 = quartile1
        self.quartile2 = quartile2
        self.quartile3 = quartile3

    def encode(self):
        return {
            'count': self.total_count,
            'mean': self.mean,
            'std': self.stddev,
            'min': self.min,
            'max': self.max,
            'quartile1': self.quartile1,
            'quartile2': self.quartile2,
            'quartile3': self.quartile3
        }


class GeneralStats:
    def __init__(self, general: [GeneralStat], histogram: [HistogramPoint], descriptive: DescriptiveStats):
        self.general = general
        self.histogram = histogram
        self.descriptive = descriptive

    def encode(self):
        return {
            'initialGeneralStats': [stat.encode() for stat in self.general],
            'initialHistogram': [point.encode() for point in self.histogram],
            'initialDescriptive': self.descriptive.encode()
        }
