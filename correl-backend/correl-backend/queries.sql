--This query returns the most recent yield data for the most recent day in the month
CREATE VIEW YIELD_CURVE AS
SELECT
    typeId,
        YEAR(ConstantDate) AS Year,
        MONTH(ConstantDate) AS Month,
        MAX(ConstantDate) AS ClosestToEndOfMonth,
        MAX(BondYield) AS LastBondYield
        FROM BOND_RATES
        GROUP BY
        YEAR(ConstantDate),
        MONTH(ConstantDate),
        typeId
        ORDER BY Year, Month,typeId DESC;